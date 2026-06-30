import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import {
  requireCurrentUser,
  requireEmployerAdmin,
  requireOrgAdmin,
  requireStaffAccess,
} from "./lib/auth";
import {
  getDateInTimezone,
  isLateEntry,
  localDateTimeToUTC,
} from "./lib/attendanceHelpers";
import { logAction } from "./audit";

export const attendanceLogValidator = v.object({
  _id: v.id("attendanceLogs"),
  _creationTime: v.number(),
  staffUserId: v.id("users"),
  employerId: v.id("users"),
  organizationId: v.optional(v.id("organizations")),
  staffProfileId: v.id("staffProfiles"),
  entryTime: v.number(),
  entryDate: v.string(), // YYYY-MM-DD in org timezone
  clockOutTime: v.optional(v.number()),
  hoursWorked: v.optional(v.number()),
  late: v.boolean(),
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
  source: v.optional(
    v.union(v.literal("web"), v.literal("mobile"), v.literal("import"))
  ),
  notes: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

// ─── Helpers ──────────────────────────────────────────────────

/** Fetch org timezone + sign-in time for a staff profile.
 *  Priority: dept-level override → settings table → org default → "09:00". */
async function getOrgConfig(
  ctx: QueryCtx | MutationCtx,
  profile: {
    organizationId?: Id<"organizations"> | null;
    employerId: Id<"users">;
    departmentId?: Id<"departments"> | null;
  }
): Promise<{ timezone: string; defaultSignInTime: string }> {
  let timezone = "UTC";
  let orgDefaultSignInTime: string | undefined;

  if (profile.organizationId) {
    const org = await ctx.db.get(profile.organizationId);
    timezone = org?.timezone ?? "UTC";
    orgDefaultSignInTime = org?.defaultSignInTime ?? undefined;
  }

  // Check per-department sign-in time override
  let deptSignInTime: string | undefined;
  if (profile.departmentId) {
    const dept = await ctx.db.get(profile.departmentId);
    deptSignInTime = dept?.defaultSignInTime ?? undefined;
  }

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

  return {
    timezone,
    defaultSignInTime:
      deptSignInTime ?? settings?.defaultSignInTime ?? orgDefaultSignInTime ?? "09:00",
  };
}

// ─── Geofence helper ──────────────────────────────────────────

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Clock In ─────────────────────────────────────────────────

/** Staff signs in for today. Date is computed server-side using org timezone. */
export const clockIn = mutation({
  args: {
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  returns: v.id("attendanceLogs"),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!profile) throw new Error("No staff profile found for your account");

    const { timezone, defaultSignInTime } = await getOrgConfig(ctx, profile);

    // ── Geofence enforcement (only when entitled + enabled) ──
    if (profile.organizationId) {
      const org = await ctx.db.get(profile.organizationId);
      const geoActive =
        org?.featuresGeoFenceAllowed && org.geoFenceEnabled && org.geoFenceLat != null && org.geoFenceLng != null;
      if (geoActive && org) {
        if (args.latitude == null || args.longitude == null) {
          throw new Error(
            "Location required: your organisation uses geofenced clock-in. Please allow location access and try again."
          );
        }
        const dist = haversineMeters(args.latitude, args.longitude, org.geoFenceLat!, org.geoFenceLng!);
        const radius = org.geoFenceRadiusMeters ?? 100;
        if (dist > radius) {
          throw new Error(
            `You are ${Math.round(dist)}m from the work zone (limit: ${radius}m). Move closer and try again.`
          );
        }
      }
    }

    const now = Date.now();
    const today = getDateInTimezone(now, timezone);

    const existing = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff_date", (q) =>
        q.eq("staffUserId", user._id).eq("entryDate", today)
      )
      .first();
    if (existing) throw new Error("You have already signed in today");

    const late = isLateEntry(now, defaultSignInTime, timezone);

    const logId = await ctx.db.insert("attendanceLogs", {
      employerId: profile.employerId,
      organizationId: profile.organizationId,
      staffUserId: user._id,
      staffProfileId: profile._id,
      entryTime: now,
      entryDate: today,
      late,
      latitude: args.latitude,
      longitude: args.longitude,
      source: "web",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(profile._id, { lastEntryTime: now, updatedAt: now });

    // Schedule late alert email if org model is active
    if (late && profile.organizationId) {
      const staffName =
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email;
      await ctx.scheduler.runAfter(0, internal.emails.sendLateAlertForOrg, {
        organizationId: profile.organizationId,
        staffName,
        entryTime: now,
      });
    }

    return logId;
  },
});

// ─── Clock Out ────────────────────────────────────────────────

/** Staff clocks out for today. Records clock-out time and hours worked. */
export const clockOut = mutation({
  args: {},
  returns: v.id("attendanceLogs"),
  handler: async (ctx, _args) => {
    const user = await requireCurrentUser(ctx);

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!profile) throw new Error("No staff profile found");

    const { timezone } = await getOrgConfig(ctx, profile);
    const today = getDateInTimezone(Date.now(), timezone);

    const todayEntry = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff_date", (q) =>
        q.eq("staffUserId", user._id).eq("entryDate", today)
      )
      .first();

    if (!todayEntry) throw new Error("No clock-in entry found for today");
    if (todayEntry.clockOutTime) throw new Error("You have already clocked out today");

    const now = Date.now();
    const rawHours = (now - todayEntry.entryTime) / 3_600_000;
    const hoursWorked = Math.round(rawHours * 100) / 100;

    await ctx.db.patch(todayEntry._id, {
      clockOutTime: now,
      hoursWorked,
      updatedAt: now,
    });

    return todayEntry._id;
  },
});

// ─── Get Today's Entry ────────────────────────────────────────

/** Returns today's attendance log for a staff member (date is server-computed). */
export const getTodayEntry = query({
  args: { staffUserId: v.id("users") },
  returns: v.union(attendanceLogValidator, v.null()),
  handler: async (ctx, args) => {
    await requireStaffAccess(ctx, args.staffUserId);

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.staffUserId))
      .unique();

    const { timezone } = await getOrgConfig(ctx, profile ?? { employerId: args.staffUserId });
    const today = getDateInTimezone(Date.now(), timezone);

    return await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff_date", (q) =>
        q.eq("staffUserId", args.staffUserId).eq("entryDate", today)
      )
      .first();
  },
});

// ─── Admin: Manual Entry ──────────────────────────────────────

/** Admin manually adds an attendance entry for a staff member on a specific date. */
export const adminAddAttendance = mutation({
  args: {
    staffUserId: v.id("users"),
    entryDate: v.string(), // YYYY-MM-DD
    entryTimeStr: v.string(), // HH:mm
  },
  returns: v.id("attendanceLogs"),
  handler: async (ctx, args) => {
    await requireStaffAccess(ctx, args.staffUserId);
    const me = await requireCurrentUser(ctx);
    if (me._id === args.staffUserId) {
      throw new Error("Use the Sign In button to record your own attendance");
    }

    const existing = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff_date", (q) =>
        q.eq("staffUserId", args.staffUserId).eq("entryDate", args.entryDate)
      )
      .first();
    if (existing) {
      throw new Error(`An entry already exists for ${args.entryDate}`);
    }

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.staffUserId))
      .unique();
    if (!profile) throw new Error("No staff profile found");

    const { timezone, defaultSignInTime } = await getOrgConfig(ctx, profile);

    const entryTimeMs = localDateTimeToUTC(args.entryDate, args.entryTimeStr, timezone);
    const late = isLateEntry(entryTimeMs, defaultSignInTime, timezone);

    const now = Date.now();
    const logId = await ctx.db.insert("attendanceLogs", {
      employerId: profile.employerId,
      organizationId: profile.organizationId,
      staffUserId: args.staffUserId,
      staffProfileId: profile._id,
      entryTime: entryTimeMs,
      entryDate: args.entryDate,
      late,
      source: "web",
      notes: "Manual entry by admin",
      createdAt: now,
      updatedAt: now,
    });

    if (!profile.lastEntryTime || entryTimeMs > profile.lastEntryTime) {
      await ctx.db.patch(profile._id, { lastEntryTime: entryTimeMs, updatedAt: now });
    }

    const staffUser = await ctx.db.get(args.staffUserId);
    await logAction(ctx, {
      organizationId: profile.organizationId,
      adminId: me._id,
      adminName: `${me.firstName ?? ""} ${me.lastName ?? ""}`.trim() || me.email,
      action: "manual_clock_in",
      targetUserId: args.staffUserId,
      targetName: staffUser
        ? `${staffUser.firstName ?? ""} ${staffUser.lastName ?? ""}`.trim() || staffUser.email
        : undefined,
      details: `Added attendance for ${args.entryDate} at ${args.entryTimeStr}`,
    });

    return logId;
  },
});

/** Admin deletes an attendance log entry. */
export const adminDeleteAttendance = mutation({
  args: { logId: v.id("attendanceLogs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireCurrentUser(ctx);
    const log = await ctx.db.get(args.logId);
    if (!log) throw new Error("Log not found");

    await requireStaffAccess(ctx, log.staffUserId);

    const staffUser = await ctx.db.get(log.staffUserId);
    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", log.staffUserId))
      .unique();

    await ctx.db.delete(args.logId);

    await logAction(ctx, {
      organizationId: log.organizationId,
      adminId: me._id,
      adminName: `${me.firstName ?? ""} ${me.lastName ?? ""}`.trim() || me.email,
      action: "delete_attendance",
      targetUserId: log.staffUserId,
      targetName: staffUser
        ? `${staffUser.firstName ?? ""} ${staffUser.lastName ?? ""}`.trim() || staffUser.email
        : undefined,
      details: `Deleted attendance entry for ${log.entryDate}`,
    });

    // Update lastEntryTime if needed
    if (profile) {
      const latest = await ctx.db
        .query("attendanceLogs")
        .withIndex("by_staff", (q) => q.eq("staffUserId", log.staffUserId))
        .order("desc")
        .first();
      await ctx.db.patch(profile._id, {
        lastEntryTime: latest?.entryTime,
        updatedAt: Date.now(),
      });
    }

    return null;
  },
});

// ─── Queries ──────────────────────────────────────────────────

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

    return {
      date: args.date,
      totalEntries: logs.length,
      uniqueStaffSignedIn: uniqueStaff.size,
      onTime: logs.length - late,
      late,
    };
  },
});

/** Daily summary using the org model. */
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

    return {
      date: args.date,
      totalEntries: logs.length,
      uniqueStaffSignedIn: uniqueStaff.size,
      onTime: logs.length - late,
      late,
    };
  },
});

/** Internal version of getOrgDailySummary — used by the daily digest email. */
export const getOrgDailySummaryInternal = internalQuery({
  args: {
    organizationId: v.id("organizations"),
    date: v.string(),
  },
  returns: v.object({
    date: v.string(),
    totalEntries: v.number(),
    uniqueStaffSignedIn: v.number(),
    totalStaff: v.number(),
    onTime: v.number(),
    late: v.number(),
  }),
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_org_date", (q) =>
        q.eq("organizationId", args.organizationId).eq("entryDate", args.date)
      )
      .collect();

    const allProfiles = await ctx.db
      .query("staffProfiles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.neq(q.field("orgRole"), "admin"))
      .collect();

    const uniqueStaff = new Set(logs.map((l) => l.staffUserId));
    const late = logs.filter((l) => l.late).length;

    return {
      date: args.date,
      totalEntries: logs.length,
      uniqueStaffSignedIn: uniqueStaff.size,
      totalStaff: allProfiles.length,
      onTime: logs.length - late,
      late,
    };
  },
});

// ─── Offline sync ─────────────────────────────────────────────

/** Sync a queued offline clock-in. Uses the original offline timestamp. */
export const clockInOffline = mutation({
  args: {
    entryTime: v.number(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  returns: v.id("attendanceLogs"),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    if (Date.now() - args.entryTime > 24 * 60 * 60 * 1_000) {
      throw new Error("Cannot sync entries older than 24 hours");
    }

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!profile) throw new Error("No staff profile found");

    if (profile.organizationId) {
      const org = await ctx.db.get(profile.organizationId);
      const offlineActive = org?.featuresOfflineSyncAllowed && org.offlineSyncEnabled;
      if (!offlineActive) {
        throw new Error("Offline sync is not enabled for your organization");
      }
    }

    const { timezone, defaultSignInTime } = await getOrgConfig(ctx, profile);
    const entryDate = getDateInTimezone(args.entryTime, timezone);

    const existing = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff_date", (q) =>
        q.eq("staffUserId", user._id).eq("entryDate", entryDate)
      )
      .first();
    if (existing) throw new Error(`Entry already exists for ${entryDate}`);

    const late = isLateEntry(args.entryTime, defaultSignInTime, timezone);
    const now = Date.now();

    const logId = await ctx.db.insert("attendanceLogs", {
      employerId: profile.employerId,
      organizationId: profile.organizationId,
      staffUserId: user._id,
      staffProfileId: profile._id,
      entryTime: args.entryTime,
      entryDate,
      late,
      latitude: args.latitude,
      longitude: args.longitude,
      source: "mobile",
      notes: "Synced from offline queue",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(profile._id, { lastEntryTime: args.entryTime, updatedAt: now });
    return logId;
  },
});

/** Legacy logEntry — kept for backward compat. Prefer adminAddAttendance. */
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
