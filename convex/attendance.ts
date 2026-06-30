import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  requireCurrentUser,
  requireEmployerAdmin,
  requireOrgAdmin,
  requireStaffAccess,
} from "./lib/auth";
import { isLateEntry } from "./lib/attendanceHelpers";

const attendanceLogValidator = v.object({
  _id: v.id("attendanceLogs"),
  _creationTime: v.number(),
  staffUserId: v.id("users"),
  employerId: v.id("users"),
  organizationId: v.optional(v.id("organizations")), // NEW
  staffProfileId: v.id("staffProfiles"),
  entryTime: v.number(),
  entryDate: v.string(),
  late: v.boolean(),
  source: v.optional(
    v.union(v.literal("web"), v.literal("mobile"), v.literal("import"))
  ),
  notes: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

/** Staff signs in for today. One entry per calendar day. */
export const clockIn = mutation({
  args: {
    today: v.string(), // YYYY-MM-DD from client
  },
  returns: v.id("attendanceLogs"),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!profile) {
      throw new Error("No staff profile found for your account");
    }

    const existing = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff_date", (q) =>
        q.eq("staffUserId", user._id).eq("entryDate", args.today)
      )
      .first();
    if (existing) {
      throw new Error("You have already signed in today");
    }

    // Fetch settings — prefer org-level, fall back to legacy employerId
    let settings = null;
    if (profile.organizationId) {
      settings = await ctx.db
        .query("employerSettings")
        .withIndex("by_organization", (q) =>
          q.eq("organizationId", profile.organizationId!)
        )
        .unique();
    }
    if (!settings) {
      settings = await ctx.db
        .query("employerSettings")
        .withIndex("by_employer", (q) => q.eq("employerId", profile.employerId))
        .unique();
    }

    const now = Date.now();
    const defaultSignInTime = settings?.defaultSignInTime ?? "09:00";
    const late = isLateEntry(now, defaultSignInTime);

    const logId = await ctx.db.insert("attendanceLogs", {
      employerId: profile.employerId,
      organizationId: profile.organizationId,
      staffUserId: user._id,
      staffProfileId: profile._id,
      entryTime: now,
      entryDate: args.today,
      late,
      source: "web",
      createdAt: now,
      updatedAt: now,
    });

    // Denormalize last entry time on profile to avoid N+1 in staff list queries
    await ctx.db.patch(profile._id, { lastEntryTime: now, updatedAt: now });

    return logId;
  },
});

export const getTodayEntry = query({
  args: {
    staffUserId: v.id("users"),
    today: v.string(),
  },
  returns: v.union(attendanceLogValidator, v.null()),
  handler: async (ctx, args) => {
    await requireStaffAccess(ctx, args.staffUserId);
    return await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff_date", (q) =>
        q.eq("staffUserId", args.staffUserId).eq("entryDate", args.today)
      )
      .first();
  },
});

export const logEntry = mutation({
  args: {
    employerId: v.id("users"),
    staffUserId: v.id("users"),
    staffProfileId: v.id("staffProfiles"),
    entryTime: v.optional(v.number()),
    late: v.boolean(),
    source: v.optional(
      v.union(v.literal("web"), v.literal("mobile"), v.literal("import"))
    ),
    notes: v.optional(v.string()),
  },
  returns: v.id("attendanceLogs"),
  handler: async (ctx, args) => {
    await requireEmployerAdmin(ctx, args.employerId);

    const profile = await ctx.db.get(args.staffProfileId);
    if (!profile || profile.employerId !== args.employerId) {
      throw new Error("Invalid staff profile");
    }
    if (profile.userId !== args.staffUserId) {
      throw new Error("Staff profile does not match user");
    }

    const now = Date.now();
    const timestamp = args.entryTime ?? now;
    const entryDate = new Date(timestamp).toISOString().slice(0, 10);

    return await ctx.db.insert("attendanceLogs", {
      employerId: args.employerId,
      staffUserId: args.staffUserId,
      staffProfileId: args.staffProfileId,
      entryTime: timestamp,
      entryDate,
      late: args.late,
      source: args.source ?? "web",
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getStaffAttendance = query({
  args: { staffUserId: v.id("users") },
  returns: v.array(attendanceLogValidator),
  handler: async (ctx, args) => {
    await requireStaffAccess(ctx, args.staffUserId);
    return await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff", (q) => q.eq("staffUserId", args.staffUserId))
      .collect();
  },
});

export const getEmployerDailySummary = query({
  args: {
    employerId: v.id("users"),
    date: v.string(),
  },
  returns: v.object({
    date: v.string(),
    totalEntries: v.number(),
    uniqueStaffSignedIn: v.number(),
    onTime: v.number(),
    late: v.number(),
  }),
  handler: async (ctx, args) => {
    await requireEmployerAdmin(ctx, args.employerId);

    const logs = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_employer_date", (q) =>
        q.eq("employerId", args.employerId).eq("entryDate", args.date)
      )
      .collect();

    const uniqueStaff = new Set(logs.map((log) => log.staffUserId));
    const late = logs.filter((log) => log.late).length;
    const onTime = logs.length - late;

    return {
      date: args.date,
      totalEntries: logs.length,
      uniqueStaffSignedIn: uniqueStaff.size,
      onTime,
      late,
    };
  },
});

/** Daily summary using the new org model. */
export const getOrgDailySummary = query({
  args: {
    organizationId: v.id("organizations"),
    date: v.string(),
  },
  returns: v.object({
    date: v.string(),
    totalEntries: v.number(),
    uniqueStaffSignedIn: v.number(),
    onTime: v.number(),
    late: v.number(),
  }),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);

    const logs = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_org_date", (q) =>
        q.eq("organizationId", args.organizationId).eq("entryDate", args.date)
      )
      .collect();

    const uniqueStaff = new Set(logs.map((log) => log.staffUserId));
    const late = logs.filter((log) => log.late).length;
    const onTime = logs.length - late;

    return {
      date: args.date,
      totalEntries: logs.length,
      uniqueStaffSignedIn: uniqueStaff.size,
      onTime,
      late,
    };
  },
});
