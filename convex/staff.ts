import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  requireCurrentUser,
  requireEmployerAdmin,
  requireOrgAdmin,
  requireStaffAccess,
} from "./lib/auth";
import { ROLE } from "./roles";

const staffListItemValidator = v.object({
  profileId: v.id("staffProfiles"),
  userId: v.id("users"),
  clerkId: v.union(v.string(), v.null()),
  email: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  role: v.union(v.literal("admin"), v.literal("manager"), v.literal("staff")),
  department: v.union(v.string(), v.null()),
  jobTitle: v.string(),
  employmentStatus: v.union(
    v.literal("active"),
    v.literal("inactive"),
    v.literal("suspended")
  ),
  lastEntryTime: v.union(v.number(), v.null()),
  needsInvite: v.boolean(),
});

/** List staff by organization (new model) — shows all non-admin members. */
export const listStaffByOrg = query({
  args: { organizationId: v.id("organizations") },
  returns: v.array(staffListItemValidator),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);

    const allProfiles = await ctx.db
      .query("staffProfiles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    // Show staff members — include profiles with orgRole "staff" or unset (legacy)
    // but exclude org admins so the dashboard isn't cluttered with admin rows.
    const profiles = allProfiles.filter((p) => p.orgRole !== "admin");

    const items = await Promise.all(
      profiles.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        const department = profile.departmentId
          ? await ctx.db.get(profile.departmentId)
          : null;

        return {
          profileId: profile._id,
          userId: profile.userId,
          clerkId: user?.clerkId ?? null,
          email: user?.email ?? "",
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          role: user?.role ?? ROLE.STAFF,
          department: department?.name ?? null,
          jobTitle: profile.jobTitle,
          employmentStatus: profile.employmentStatus,
          lastEntryTime: profile.lastEntryTime ?? null,
          needsInvite: Boolean(user?.clerkId?.startsWith("legacy:")),
        };
      })
    );

    return items;
  },
});

export const listStaffByEmployer = query({
  args: { employerId: v.id("users") },
  returns: v.array(staffListItemValidator),
  handler: async (ctx, args) => {
    await requireEmployerAdmin(ctx, args.employerId);

    const profiles = await ctx.db
      .query("staffProfiles")
      .withIndex("by_employer", (q) => q.eq("employerId", args.employerId))
      .collect();

    const items = await Promise.all(
      profiles.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        const department = profile.departmentId
          ? await ctx.db.get(profile.departmentId)
          : null;

        return {
          profileId: profile._id,
          userId: profile.userId,
          clerkId: user?.clerkId ?? null,
          email: user?.email ?? "",
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          role: user?.role ?? ROLE.STAFF,
          department: department?.name ?? null,
          jobTitle: profile.jobTitle,
          employmentStatus: profile.employmentStatus,
          lastEntryTime: profile.lastEntryTime ?? null,
          needsInvite: Boolean(user?.clerkId?.startsWith("legacy:")),
        };
      })
    );

    return items;
  },
});

export const createStaffProfile = mutation({
  args: {
    employerId: v.id("users"),
    userId: v.id("users"),
    jobTitle: v.string(),
    departmentId: v.optional(v.id("departments")),
    timezone: v.optional(v.string()),
    startDate: v.optional(v.string()),
  },
  returns: v.id("staffProfiles"),
  handler: async (ctx, args) => {
    await requireEmployerAdmin(ctx, args.employerId);
    const now = Date.now();

    return await ctx.db.insert("staffProfiles", {
      employerId: args.employerId,
      userId: args.userId,
      departmentId: args.departmentId,
      jobTitle: args.jobTitle,
      employmentStatus: "active",
      timezone: args.timezone,
      startDate: args.startDate,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Create staff within an organization (new model). */
export const createStaffInOrg = mutation({
  args: {
    organizationId: v.id("organizations"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    jobTitle: v.string(),
    departmentId: v.optional(v.id("departments")),
  },
  returns: v.id("staffProfiles"),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    const now = Date.now();
    const normalizedEmail = args.email.trim().toLowerCase();

    // Find or create the user
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .unique();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: `legacy:${normalizedEmail}`,
        email: normalizedEmail,
        firstName: args.firstName,
        lastName: args.lastName,
        fullName: `${args.firstName} ${args.lastName}`.trim(),
        role: ROLE.STAFF,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      user = await ctx.db.get(userId);
    } else {
      await ctx.db.patch(user._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        fullName: `${args.firstName} ${args.lastName}`.trim(),
        updatedAt: now,
      });
      user = await ctx.db.get(user._id);
    }

    if (!user) throw new Error("Failed to create staff user");

    // Find the org admin's user ID for backward-compat employerId field
    const adminProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("orgRole"), "admin"))
      .first();
    const employerId = adminProfile?.userId ?? user._id;

    // Check for existing profile in this org
    const existingProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_org_and_user", (q) =>
        q.eq("organizationId", args.organizationId).eq("userId", user!._id)
      )
      .unique();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        departmentId: args.departmentId,
        jobTitle: args.jobTitle || "Staff",
        orgRole: "staff",
        updatedAt: now,
      });
      return existingProfile._id;
    }

    return await ctx.db.insert("staffProfiles", {
      userId: user._id,
      employerId,
      organizationId: args.organizationId,
      orgRole: "staff",
      departmentId: args.departmentId,
      jobTitle: args.jobTitle || "Staff",
      employmentStatus: "active",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const createStaffFromDashboard = mutation({
  args: {
    employerId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    role: v.string(),
    departmentId: v.optional(v.id("departments")),
  },
  returns: v.id("staffProfiles"),
  handler: async (ctx, args) => {
    await requireEmployerAdmin(ctx, args.employerId);
    const now = Date.now();
    const normalizedEmail = args.email.trim().toLowerCase();

    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .unique();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: `legacy:${normalizedEmail}`,
        email: normalizedEmail,
        firstName: args.firstName,
        lastName: args.lastName,
        fullName: `${args.firstName} ${args.lastName}`.trim(),
        role: ROLE.STAFF,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      user = await ctx.db.get(userId);
    } else {
      await ctx.db.patch(user._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        fullName: `${args.firstName} ${args.lastName}`.trim(),
        role: ROLE.STAFF,
        updatedAt: now,
      });
      user = await ctx.db.get(user._id);
    }

    if (!user) throw new Error("Failed to create staff user");

    // Also find org if admin has one (bridge old and new models)
    const adminOrgProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.employerId))
      .filter((q) => q.eq(q.field("orgRole"), "admin"))
      .first();

    const existingProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user!._id))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        departmentId: args.departmentId,
        jobTitle: args.role || "Staff",
        employerId: args.employerId,
        organizationId: adminOrgProfile?.organizationId,
        orgRole: "staff",
        updatedAt: now,
      });
      return existingProfile._id;
    }

    return await ctx.db.insert("staffProfiles", {
      userId: user._id,
      employerId: args.employerId,
      organizationId: adminOrgProfile?.organizationId,
      orgRole: "staff",
      departmentId: args.departmentId,
      jobTitle: args.role || "Staff",
      employmentStatus: "active",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const removeStaffByUserId = mutation({
  args: {
    userId: v.id("users"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) {
      throw new Error("Staff profile not found");
    }

    if (profile.organizationId) {
      await requireOrgAdmin(ctx, profile.organizationId);
    } else {
      await requireEmployerAdmin(ctx, profile.employerId);
    }

    const attendance = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff", (q) => q.eq("staffUserId", args.userId))
      .collect();
    for (const row of attendance) {
      await ctx.db.delete(row._id);
    }
    await ctx.db.delete(profile._id);
    await ctx.db.delete(args.userId);
    return true;
  },
});

const staffDetailValidator = v.union(
  v.object({
    staff: v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      clerkId: v.string(),
      email: v.string(),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      fullName: v.optional(v.string()),
      role: v.union(v.literal("admin"), v.literal("manager"), v.literal("staff")),
      organizationName: v.optional(v.string()),
      isActive: v.boolean(),
      lastLoginAt: v.optional(v.number()),
      platformRole: v.optional(v.literal("superAdmin")), // NEW
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    profile: v.union(
      v.object({
        _id: v.id("staffProfiles"),
        _creationTime: v.number(),
        userId: v.id("users"),
        employerId: v.id("users"),
        organizationId: v.optional(v.id("organizations")),
        orgRole: v.optional(v.union(v.literal("admin"), v.literal("staff"))),
        departmentId: v.optional(v.id("departments")),
        jobTitle: v.string(),
        employmentStatus: v.union(
          v.literal("active"),
          v.literal("inactive"),
          v.literal("suspended")
        ),
        timezone: v.optional(v.string()),
        startDate: v.optional(v.string()),
        lastEntryTime: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
      }),
      v.null()
    ),
    entryLogs: v.array(
      v.object({
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
      })
    ),
  }),
  v.null()
);

export const getStaffDetail = query({
  args: {
    staffUserId: v.id("users"),
  },
  returns: staffDetailValidator,
  handler: async (ctx, args) => {
    await requireStaffAccess(ctx, args.staffUserId);

    const staff = await ctx.db.get(args.staffUserId);
    if (!staff) return null;

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.staffUserId))
      .unique();

    const entryLogs = await ctx.db
      .query("attendanceLogs")
      .withIndex("by_staff", (q) => q.eq("staffUserId", args.staffUserId))
      .collect();

    return {
      staff,
      profile,
      entryLogs,
    };
  },
});

/** Update basic profile info — staff can edit their own, admins can edit any staff in their org. */
export const updateStaffProfile = mutation({
  args: {
    staffUserId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    departmentId: v.optional(v.id("departments")),
    employmentStatus: v.optional(
      v.union(v.literal("active"), v.literal("inactive"), v.literal("suspended"))
    ),
    timezone: v.optional(v.string()),
    startDate: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireStaffAccess(ctx, args.staffUserId);
    const now = Date.now();

    // Update user name fields if provided
    if (args.firstName !== undefined || args.lastName !== undefined) {
      const user = await ctx.db.get(args.staffUserId);
      if (user) {
        const firstName = args.firstName ?? user.firstName ?? "";
        const lastName = args.lastName ?? user.lastName ?? "";
        await ctx.db.patch(args.staffUserId, {
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`.trim(),
          updatedAt: now,
        });
      }
    }

    // Update profile fields
    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.staffUserId))
      .unique();

    if (profile) {
      const profileUpdates: Record<string, unknown> = { updatedAt: now };
      if (args.jobTitle !== undefined) profileUpdates.jobTitle = args.jobTitle;
      if (args.departmentId !== undefined) profileUpdates.departmentId = args.departmentId;
      if (args.employmentStatus !== undefined) profileUpdates.employmentStatus = args.employmentStatus;
      if (args.timezone !== undefined) profileUpdates.timezone = args.timezone;
      if (args.startDate !== undefined) profileUpdates.startDate = args.startDate;
      await ctx.db.patch(profile._id, profileUpdates);
    }

    return null;
  },
});
