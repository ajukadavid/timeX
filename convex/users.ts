import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { resolveCurrentUser } from "./lib/auth";
import { ROLE } from "./roles";

const userDocValidator = v.object({
  _id: v.id("users"),
  _creationTime: v.number(),
  clerkId: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  fullName: v.optional(v.string()),
  role: v.union(
    v.literal(ROLE.ADMIN),
    v.literal(ROLE.MANAGER),
    v.literal(ROLE.STAFF)
  ),
  organizationName: v.optional(v.string()),
  isActive: v.boolean(),
  lastLoginAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const getCurrentUser = query({
  args: {},
  returns: v.union(userDocValidator, v.null()),
  handler: async (ctx) => resolveCurrentUser(ctx),
});

/** Where to send the user right after Clerk sign-in. */
export const getPostLoginPath = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) return null;

    if (user.role === ROLE.ADMIN) {
      return "/dashboardEmployer";
    }

    return `/dashboardStaff/${user._id}`;
  },
});

/** Links imported legacy users to Clerk after sign-in (webhook may be delayed). */
export const linkAuthenticatedUser = mutation({
  args: {},
  returns: v.id("users"),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const email = identity.email ? normalizeEmail(identity.email) : null;
    if (!email) {
      throw new Error("No email on Clerk account");
    }

    const now = Date.now();
    const clerkId = identity.subject;

    const existingByClerk = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
    if (existingByClerk) return existingByClerk._id;

    const legacyByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (legacyByEmail) {
      await ctx.db.patch(legacyByEmail._id, {
        clerkId,
        updatedAt: now,
      });
      return legacyByEmail._id;
    }

    return await ctx.db.insert("users", {
      clerkId,
      email,
      firstName: identity.givenName ?? undefined,
      lastName: identity.familyName ?? undefined,
      fullName: identity.name ?? undefined,
      role: ROLE.STAFF,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const upsertFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    fullName: v.optional(v.string()),
    role: v.optional(v.union(v.literal(ROLE.ADMIN), v.literal(ROLE.MANAGER), v.literal(ROLE.STAFF))),
    organizationName: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const email = normalizeEmail(args.email);

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    const payload = {
      email,
      firstName: args.firstName,
      lastName: args.lastName,
      fullName: args.fullName,
      role: args.role ?? ROLE.STAFF,
      organizationName: args.organizationName,
      isActive: args.isActive ?? true,
      updatedAt: now,
    };

    if (existing) {
      // Webhooks often omit role in public_metadata — never downgrade Convex roles.
      await ctx.db.patch(existing._id, {
        ...payload,
        role: args.role ?? existing.role,
        organizationName:
          args.organizationName ?? existing.organizationName,
      });
      return existing._id;
    }

    // Link migrated export/Mongo user (legacy:*) to this Clerk account by email.
    const legacyByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (legacyByEmail?.clerkId.startsWith("legacy:")) {
      await ctx.db.patch(legacyByEmail._id, {
        clerkId: args.clerkId,
        ...payload,
        role: legacyByEmail.role ?? payload.role,
        organizationName:
          legacyByEmail.organizationName ?? payload.organizationName,
      });
      return legacyByEmail._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      ...payload,
      createdAt: now,
    });
  },
});

export const removeByClerkId = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!existing) return null;

    await ctx.db.delete(existing._id);
    return existing._id;
  },
});

export const upsertLegacyUser = mutation({
  args: {
    sourceId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    fullName: v.optional(v.string()),
    role: v.union(v.literal(ROLE.ADMIN), v.literal(ROLE.MANAGER), v.literal(ROLE.STAFF)),
    organizationName: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const legacyClerkId = `legacy:${args.sourceId}`;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", legacyClerkId))
      .unique();

    const payload = {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      fullName: args.fullName,
      role: args.role,
      organizationName: args.organizationName,
      isActive: args.isActive ?? true,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: legacyClerkId,
      ...payload,
      createdAt: now,
    });
  },
});

/**
 * Removes duplicate user rows that share the same email.
 * Keeps the row with the real clerkId (non-legacy) if one exists,
 * otherwise keeps the most recently created one.
 */
export const deduplicateUsers = internalMutation({
  args: {},
  returns: v.object({ deleted: v.number() }),
  handler: async (ctx) => {
    const all = await ctx.db.query("users").collect();

    // Group by normalised email
    const byEmail = new Map<string, typeof all>();
    for (const u of all) {
      const key = u.email.trim().toLowerCase();
      if (!byEmail.has(key)) byEmail.set(key, []);
      byEmail.get(key)!.push(u);
    }

    let deleted = 0;
    for (const [, group] of byEmail) {
      if (group.length <= 1) continue;

      const profileCountByUserId = new Map(
        await Promise.all(
          group.map(async (u) => {
            const profiles = await ctx.db
              .query("staffProfiles")
              .withIndex("by_employer", (q) => q.eq("employerId", u._id))
              .collect();
            return [u._id, profiles.length] as const;
          })
        )
      );

      // Prefer the row staff data points at, then real Clerk ID, then admin role.
      group.sort((a, b) => {
        const aProfiles = profileCountByUserId.get(a._id) ?? 0;
        const bProfiles = profileCountByUserId.get(b._id) ?? 0;
        if (aProfiles !== bProfiles) return bProfiles - aProfiles;

        const aReal = !a.clerkId.startsWith("legacy:");
        const bReal = !b.clerkId.startsWith("legacy:");
        if (aReal !== bReal) return aReal ? -1 : 1;

        if (a.role === ROLE.ADMIN && b.role !== ROLE.ADMIN) return -1;
        if (b.role === ROLE.ADMIN && a.role !== ROLE.ADMIN) return 1;

        return b._creationTime - a._creationTime;
      });

      // Keep index 0, delete the rest
      for (let i = 1; i < group.length; i++) {
        await ctx.db.delete(group[i]!._id);
        deleted++;
      }
    }

    return { deleted };
  },
});

/** Admin helper — set a user's role by email. Run via: npx convex run internal/users:setUserRole */
export const setUserRole = internalMutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("staff")),
  },
  returns: v.object({
    updated: v.string(),
    newRole: v.union(
      v.literal("admin"),
      v.literal("manager"),
      v.literal("staff")
    ),
  }),
  handler: async (ctx, { email, role }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email.trim().toLowerCase()))
      .unique();
    if (!user) throw new Error(`No user found with email: ${email}`);
    await ctx.db.patch(user._id, { role, updatedAt: Date.now() });
    return { updated: user.email, newRole: role };
  },
});

const provisionUserValidator = v.object({
  _id: v.id("users"),
  clerkId: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  role: v.union(
    v.literal(ROLE.ADMIN),
    v.literal(ROLE.MANAGER),
    v.literal(ROLE.STAFF)
  ),
});

/** All users for bulk Clerk provisioning scripts. */
export const listAllUsersForProvisioning = internalQuery({
  args: {},
  returns: v.array(provisionUserValidator),
  handler: async (ctx) => {
    const all = await ctx.db.query("users").collect();
    return all
      .filter((u) => u.email.includes("@"))
      .map((u) => ({
        _id: u._id,
        clerkId: u.clerkId,
        email: u.email.trim().toLowerCase(),
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
      }));
  },
});

/** Returns all users whose clerkId starts with "legacy:" — used by bulk sync scripts. */
export const listLegacyUsers = internalQuery({
  args: {},
  returns: v.array(provisionUserValidator),
  handler: async (ctx) => {
    const all = await ctx.db.query("users").collect();
    return all
      .filter((u) => u.clerkId.startsWith("legacy:"))
      .map((u) => ({
        _id: u._id,
        clerkId: u.clerkId,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
      }));
  },
});

/** Patches clerkId on a single user row — used after creating them in Clerk. */
export const setClerkId = internalMutation({
  args: {
    userId: v.id("users"),
    clerkId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { userId, clerkId }) => {
    await ctx.db.patch(userId, { clerkId, updatedAt: Date.now() });
    return null;
  },
});

/** Inspect employer ↔ staff links (run after dedup / prod migration). */
export const diagnoseEmployerData = internalQuery({
  args: {
    adminEmail: v.optional(v.string()),
  },
  returns: v.object({
    adminUser: v.union(
      v.object({
        _id: v.id("users"),
        email: v.string(),
        role: v.string(),
        clerkId: v.string(),
      }),
      v.null()
    ),
    staffProfileCountForAdmin: v.number(),
    distinctEmployerIdsOnProfiles: v.array(v.string()),
    orphanedEmployerIds: v.array(v.string()),
    totalStaffProfiles: v.number(),
    totalDepartments: v.number(),
    departmentsForAdmin: v.number(),
  }),
  handler: async (ctx, args) => {
    const email = args.adminEmail?.trim().toLowerCase();
    let adminUser = null;

    if (email) {
      adminUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
    } else {
      const admins = await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", ROLE.ADMIN))
        .collect();
      adminUser = admins[0] ?? null;
    }

    const profiles = await ctx.db.query("staffProfiles").collect();
    const departments = await ctx.db.query("departments").collect();

    const employerIds = [...new Set(profiles.map((p) => p.employerId))];
    const orphanedEmployerIds: string[] = [];

    for (const employerId of employerIds) {
      const employer = await ctx.db.get(employerId);
      if (!employer) orphanedEmployerIds.push(employerId);
    }

    const staffProfileCountForAdmin = adminUser
      ? profiles.filter((p) => p.employerId === adminUser._id).length
      : 0;

    const departmentsForAdmin = adminUser
      ? departments.filter((d) => d.employerId === adminUser._id).length
      : 0;

    return {
      adminUser: adminUser
        ? {
            _id: adminUser._id,
            email: adminUser.email,
            role: adminUser.role,
            clerkId: adminUser.clerkId,
          }
        : null,
      staffProfileCountForAdmin,
      distinctEmployerIdsOnProfiles: employerIds,
      orphanedEmployerIds,
      totalStaffProfiles: profiles.length,
      totalDepartments: departments.length,
      departmentsForAdmin,
    };
  },
});

/**
 * Re-point staff/departments/attendance/settings from deleted employer rows
 * to the surviving admin user (fixes dedup + webhook duplicate fallout).
 */
export const repairEmployerLinks = internalMutation({
  args: {
    adminEmail: v.string(),
    dryRun: v.optional(v.boolean()),
  },
  returns: v.object({
    adminId: v.id("users"),
    repairedStaffProfiles: v.number(),
    repairedDepartments: v.number(),
    repairedAttendanceLogs: v.number(),
    repairedSettings: v.number(),
    dryRun: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) =>
        q.eq("email", args.adminEmail.trim().toLowerCase())
      )
      .unique();
    if (!admin) {
      throw new Error(`No user found with email: ${args.adminEmail}`);
    }
    if (admin.role !== ROLE.ADMIN) {
      throw new Error(`${args.adminEmail} is not an admin user`);
    }

    const dryRun = args.dryRun ?? false;
    let repairedStaffProfiles = 0;
    let repairedDepartments = 0;
    let repairedAttendanceLogs = 0;
    let repairedSettings = 0;

    const profiles = await ctx.db.query("staffProfiles").collect();
    for (const profile of profiles) {
      if (profile.employerId === admin._id) continue;
      const employer = await ctx.db.get(profile.employerId);
      if (employer) continue;
      repairedStaffProfiles++;
      if (!dryRun) {
        await ctx.db.patch(profile._id, {
          employerId: admin._id,
          updatedAt: Date.now(),
        });
      }
    }

    const departments = await ctx.db.query("departments").collect();
    for (const dept of departments) {
      if (dept.employerId === admin._id) continue;
      const employer = await ctx.db.get(dept.employerId);
      if (employer) continue;
      repairedDepartments++;
      if (!dryRun) {
        await ctx.db.patch(dept._id, {
          employerId: admin._id,
          updatedAt: Date.now(),
        });
      }
    }

    const logs = await ctx.db.query("attendanceLogs").collect();
    for (const log of logs) {
      if (log.employerId === admin._id) continue;
      const employer = await ctx.db.get(log.employerId);
      if (employer) continue;
      repairedAttendanceLogs++;
      if (!dryRun) {
        await ctx.db.patch(log._id, {
          employerId: admin._id,
          updatedAt: Date.now(),
        });
      }
    }

    const settings = await ctx.db.query("employerSettings").collect();
    for (const setting of settings) {
      if (setting.employerId === admin._id) continue;
      const employer = await ctx.db.get(setting.employerId);
      if (employer) continue;
      repairedSettings++;
      if (!dryRun) {
        await ctx.db.patch(setting._id, {
          employerId: admin._id,
          updatedAt: Date.now(),
        });
      }
    }

    return {
      adminId: admin._id,
      repairedStaffProfiles,
      repairedDepartments,
      repairedAttendanceLogs,
      repairedSettings,
      dryRun,
    };
  },
});
