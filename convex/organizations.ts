import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { requireCurrentUser, requireOrgAdmin, requireSuperAdmin, resolveCurrentUser } from "./lib/auth";
import {
  isPaidOrg,
  orgFeatureFlagsValidator,
  resolveOrgFeatureFlags,
  revokedPremiumFeaturePatches,
  subscriptionTierValidator,
} from "./lib/orgFeatures";
import { ROLE } from "./roles";
import { logAction } from "./audit";

// ─── Shared validators ─────────────────────────────────────────

const orgValidator = v.object({
  _id: v.id("organizations"),
  _creationTime: v.number(),
  name: v.string(),
  timezone: v.string(),
  defaultSignInTime: v.optional(v.string()),
  isActive: v.boolean(),
  subscriptionTier: v.optional(subscriptionTierValidator),
  featuresGeoFenceAllowed: v.optional(v.boolean()),
  featuresBiometricAllowed: v.optional(v.boolean()),
  featuresOfflineSyncAllowed: v.optional(v.boolean()),
  geoFenceEnabled: v.optional(v.boolean()),
  geoFenceLat: v.optional(v.number()),
  geoFenceLng: v.optional(v.number()),
  geoFenceRadiusMeters: v.optional(v.number()),
  biometricEnabled: v.optional(v.boolean()),
  offlineSyncEnabled: v.optional(v.boolean()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

/** Returns premium feature flags for the current user's organization. */
export const getMyOrgFeatures = query({
  args: {},
  returns: v.union(orgFeatureFlagsValidator, v.null()),
  handler: async (ctx) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) return null;

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!profile?.organizationId) return null;

    const org = await ctx.db.get(profile.organizationId);
    if (!org) return null;

    return resolveOrgFeatureFlags(org);
  },
});

/** Returns premium feature flags for an org (super admin or org admin). */
export const getOrgFeatures = query({
  args: { organizationId: v.id("organizations") },
  returns: orgFeatureFlagsValidator,
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");
    return resolveOrgFeatureFlags(org);
  },
});

// ─── Super admin queries ───────────────────────────────────────

/** List all organizations on the platform (super admin only). */
export const listAll = query({
  args: {},
  returns: v.array(
    v.object({
      org: orgValidator,
      staffCount: v.number(),
      adminEmail: v.union(v.string(), v.null()),
      adminName: v.union(v.string(), v.null()),
    })
  ),
  handler: async (ctx) => {
    await requireSuperAdmin(ctx);

    const orgs = await ctx.db.query("organizations").collect();

    return await Promise.all(
      orgs.map(async (org) => {
        const profiles = await ctx.db
          .query("staffProfiles")
          .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
          .collect();

        const staffCount = profiles.filter((p) => p.orgRole === "staff").length;

        const adminProfile = profiles.find((p) => p.orgRole === "admin");
        let adminEmail: string | null = null;
        let adminName: string | null = null;
        if (adminProfile) {
          const adminUser = await ctx.db.get(adminProfile.userId);
          adminEmail = adminUser?.email ?? null;
          adminName = adminUser?.fullName ?? adminUser?.firstName ?? null;
        }

        return { org, staffCount, adminEmail, adminName };
      })
    );
  },
});

/** Get one org (super admin or that org's admin). */
export const getOrg = query({
  args: { organizationId: v.id("organizations") },
  returns: v.union(orgValidator, v.null()),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    return await ctx.db.get(args.organizationId);
  },
});

/** Platform stats for super admin overview. */
export const getPlatformStats = query({
  args: {},
  returns: v.object({
    totalOrgs: v.number(),
    activeOrgs: v.number(),
    totalStaff: v.number(),
    totalUsers: v.number(),
  }),
  handler: async (ctx) => {
    await requireSuperAdmin(ctx);

    const orgs = await ctx.db.query("organizations").collect();
    const activeOrgs = orgs.filter((o) => o.isActive).length;

    const profiles = await ctx.db.query("staffProfiles").collect();
    const staffCount = profiles.filter((p) => p.orgRole === "staff").length;

    const users = await ctx.db.query("users").collect();

    return {
      totalOrgs: orgs.length,
      activeOrgs,
      totalStaff: staffCount,
      totalUsers: users.length,
    };
  },
});

// ─── Org admin queries ─────────────────────────────────────────

/** Returns the org the current user administers (null if not an org admin). */
export const getMyAdminOrg = query({
  args: {},
  returns: v.union(orgValidator, v.null()),
  handler: async (ctx) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) return null;

    const adminProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("orgRole"), "admin"))
      .first();

    if (!adminProfile?.organizationId) return null;
    return await ctx.db.get(adminProfile.organizationId);
  },
});

// ─── Super admin mutations ──────────────────────────────────────

/** Create a brand-new organization (super admin only). */
export const createOrg = mutation({
  args: {
    name: v.string(),
    timezone: v.string(),
    defaultSignInTime: v.optional(v.string()),
    adminEmail: v.string(),
    adminFirstName: v.string(),
    adminLastName: v.string(),
  },
  returns: v.object({
    organizationId: v.id("organizations"),
    adminUserId: v.id("users"),
  }),
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);
    const now = Date.now();
    const normalizedEmail = args.adminEmail.trim().toLowerCase();

    // 1. Create organization
    const organizationId = await ctx.db.insert("organizations", {
      name: args.name,
      timezone: args.timezone,
      defaultSignInTime: args.defaultSignInTime,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Find or create admin user
    let adminUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .unique();

    if (!adminUser) {
      const adminUserId = await ctx.db.insert("users", {
        clerkId: `legacy:${normalizedEmail}`,
        email: normalizedEmail,
        firstName: args.adminFirstName,
        lastName: args.adminLastName,
        fullName: `${args.adminFirstName} ${args.adminLastName}`.trim(),
        role: ROLE.ADMIN,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      adminUser = await ctx.db.get(adminUserId);
    } else {
      await ctx.db.patch(adminUser._id, {
        role: ROLE.ADMIN,
        updatedAt: now,
      });
      adminUser = await ctx.db.get(adminUser._id);
    }

    if (!adminUser) throw new Error("Failed to create admin user");

    // 3. Create admin's staffProfile in the org
    const existing = await ctx.db
      .query("staffProfiles")
      .withIndex("by_org_and_user", (q) =>
        q.eq("organizationId", organizationId).eq("userId", adminUser!._id)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert("staffProfiles", {
        userId: adminUser._id,
        employerId: adminUser._id, // legacy self-reference for backward compat
        organizationId,
        orgRole: "admin",
        jobTitle: "Organization Admin",
        employmentStatus: "active",
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(existing._id, {
        organizationId,
        orgRole: "admin",
        updatedAt: now,
      });
    }

    // 4. Create employer settings for the org
    const existingSettings = await ctx.db
      .query("employerSettings")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .unique();

    if (!existingSettings) {
      await ctx.db.insert("employerSettings", {
        employerId: adminUser._id, // legacy
        organizationId,
        defaultSignInTime: args.defaultSignInTime,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { organizationId, adminUserId: adminUser._id };
  },
});

/** Activate or deactivate an org (super admin only). */
export const toggleOrgActive = mutation({
  args: { organizationId: v.id("organizations"), isActive: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);
    await ctx.db.patch(args.organizationId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─── Org settings ──────────────────────────────────────────────

export const updateOrgSettings = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.optional(v.string()),
    timezone: v.optional(v.string()),
    defaultSignInTime: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.timezone !== undefined) updates.timezone = args.timezone;
    if (args.defaultSignInTime !== undefined)
      updates.defaultSignInTime = args.defaultSignInTime;
    await ctx.db.patch(args.organizationId, updates);
    return null;
  },
});

/** Super admin: set subscription tier. Downgrading to free revokes all premium access. */
export const setOrgSubscriptionTier = mutation({
  args: {
    organizationId: v.id("organizations"),
    subscriptionTier: subscriptionTierValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);
    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");

    if (args.subscriptionTier === "free") {
      await ctx.db.patch(args.organizationId, {
        subscriptionTier: "free",
        ...revokedPremiumFeaturePatches(),
      });
    } else {
      await ctx.db.patch(args.organizationId, {
        subscriptionTier: "paid",
        updatedAt: Date.now(),
      });
    }
    return null;
  },
});

/**
 * Super admin: grant or revoke premium feature entitlements for an org.
 * Entitlements can only be enabled when subscriptionTier is "paid".
 */
export const setOrgFeatureEntitlements = mutation({
  args: {
    organizationId: v.id("organizations"),
    featuresGeoFenceAllowed: v.optional(v.boolean()),
    featuresBiometricAllowed: v.optional(v.boolean()),
    featuresOfflineSyncAllowed: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);
    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");

    const enablingAny =
      args.featuresGeoFenceAllowed === true ||
      args.featuresBiometricAllowed === true ||
      args.featuresOfflineSyncAllowed === true;

    if (enablingAny && !isPaidOrg(org)) {
      throw new Error(
        "Premium features require a paid subscription. Set the organization to Paid first."
      );
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    if (args.featuresGeoFenceAllowed !== undefined) {
      updates.featuresGeoFenceAllowed = args.featuresGeoFenceAllowed;
      if (!args.featuresGeoFenceAllowed) updates.geoFenceEnabled = false;
    }
    if (args.featuresBiometricAllowed !== undefined) {
      updates.featuresBiometricAllowed = args.featuresBiometricAllowed;
      if (!args.featuresBiometricAllowed) updates.biometricEnabled = false;
    }
    if (args.featuresOfflineSyncAllowed !== undefined) {
      updates.featuresOfflineSyncAllowed = args.featuresOfflineSyncAllowed;
      if (!args.featuresOfflineSyncAllowed) updates.offlineSyncEnabled = false;
    }

    await ctx.db.patch(args.organizationId, updates);
    return null;
  },
});

/** Org admin: toggle premium features on/off (only if entitled by super admin). */
export const updateOrgFeatureToggles = mutation({
  args: {
    organizationId: v.id("organizations"),
    geoFenceEnabled: v.optional(v.boolean()),
    biometricEnabled: v.optional(v.boolean()),
    offlineSyncEnabled: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");

    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    if (args.geoFenceEnabled !== undefined) {
      if (args.geoFenceEnabled && !org.featuresGeoFenceAllowed) {
        throw new Error("Geofencing is not enabled for your organization. Contact Logasiko support.");
      }
      updates.geoFenceEnabled = args.geoFenceEnabled;
    }
    if (args.biometricEnabled !== undefined) {
      if (args.biometricEnabled && !org.featuresBiometricAllowed) {
        throw new Error("Biometric sign-in is not enabled for your organization. Contact Logasiko support.");
      }
      updates.biometricEnabled = args.biometricEnabled;
    }
    if (args.offlineSyncEnabled !== undefined) {
      if (args.offlineSyncEnabled && !org.featuresOfflineSyncAllowed) {
        throw new Error("Offline sync is not enabled for your organization. Contact Logasiko support.");
      }
      updates.offlineSyncEnabled = args.offlineSyncEnabled;
    }

    await ctx.db.patch(args.organizationId, updates);
    return null;
  },
});

/** Update or remove the geofence for an org (org admin only). */
export const updateGeoFence = mutation({
  args: {
    organizationId: v.id("organizations"),
    enabled: v.boolean(),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    radiusMeters: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");

    if (args.enabled && !org.featuresGeoFenceAllowed) {
      throw new Error("Geofencing is not enabled for your organization. Contact Logasiko support.");
    }

    await ctx.db.patch(args.organizationId, {
      geoFenceEnabled: args.enabled,
      geoFenceLat: args.lat ?? undefined,
      geoFenceLng: args.lng ?? undefined,
      geoFenceRadiusMeters: args.radiusMeters ?? undefined,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─── Org admin management ──────────────────────────────────────

/**
 * Promote or demote a user's role within an org.
 * Callable from the super admin UI or CLI:
 *   npx convex run organizations:setOrgMemberRole \
 *     '{"organizationId":"<orgId>","userId":"<userId>","orgRole":"admin"}'
 */
export const setOrgMemberRole = mutation({
  args: {
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    orgRole: v.union(v.literal("admin"), v.literal("staff")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireOrgAdmin(ctx, args.organizationId);
    const now = Date.now();

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_org_and_user", (q) =>
        q.eq("organizationId", args.organizationId).eq("userId", args.userId)
      )
      .unique();

    if (!profile) {
      const adminProfile = await ctx.db
        .query("staffProfiles")
        .withIndex("by_organization", (q) =>
          q.eq("organizationId", args.organizationId)
        )
        .filter((q) => q.eq(q.field("orgRole"), "admin"))
        .first();

      await ctx.db.insert("staffProfiles", {
        userId: args.userId,
        employerId: adminProfile?.userId ?? args.userId,
        organizationId: args.organizationId,
        orgRole: args.orgRole,
        jobTitle: args.orgRole === "admin" ? "Organization Admin" : "Staff",
        employmentStatus: "active",
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(profile._id, {
        orgRole: args.orgRole,
        updatedAt: now,
      });
    }

    await ctx.db.patch(args.userId, {
      role: args.orgRole === "admin" ? ROLE.ADMIN : ROLE.STAFF,
      updatedAt: now,
    });

    const targetUser = await ctx.db.get(args.userId);
    await logAction(ctx, {
      organizationId: args.organizationId,
      adminId: me._id,
      adminName: `${me.firstName ?? ""} ${me.lastName ?? ""}`.trim() || me.email,
      action: "role_change",
      targetUserId: args.userId,
      targetName: targetUser
        ? `${targetUser.firstName ?? ""} ${targetUser.lastName ?? ""}`.trim() || targetUser.email
        : undefined,
      details: `Role changed to ${args.orgRole}`,
    });

    return null;
  },
});

/**
 * List all staff in an org with their profile details (super admin + org admin).
 * Returns both admin and staff members so the super admin can see the full picture.
 */
export const listOrgMembers = query({
  args: { organizationId: v.id("organizations") },
  returns: v.array(
    v.object({
      userId: v.id("users"),
      profileId: v.id("staffProfiles"),
      email: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      orgRole: v.union(v.literal("admin"), v.literal("staff")),
      jobTitle: v.string(),
      employmentStatus: v.union(
        v.literal("active"),
        v.literal("inactive"),
        v.literal("suspended")
      ),
      needsInvite: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);

    const profiles = await ctx.db
      .query("staffProfiles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    return await Promise.all(
      profiles.map(async (p) => {
        const user = await ctx.db.get(p.userId);
        return {
          userId: p.userId,
          profileId: p._id,
          email: user?.email ?? "",
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          orgRole: (p.orgRole ?? "staff") as "admin" | "staff",
          jobTitle: p.jobTitle,
          employmentStatus: p.employmentStatus,
          needsInvite: Boolean(user?.clerkId?.startsWith("legacy:")),
        };
      })
    );
  },
});

// ─── Internal helpers ──────────────────────────────────────────

/** Internal: set platformRole on a user (run via CLI to crown yourself superAdmin). */
export const setPlatformRole = internalMutation({
  args: {
    userId: v.id("users"),
    platformRole: v.optional(v.literal("superAdmin")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      platformRole: args.platformRole,
      updatedAt: Date.now(),
    });
    return null;
  },
});

/** Internal: list all orgs (used by migration checks). */
export const listAllInternal = internalQuery({
  args: {},
  returns: v.array(orgValidator),
  handler: async (ctx) => {
    return await ctx.db.query("organizations").collect();
  },
});

/** Internal: list all active orgs — used by the daily digest email cron. */
export const listAllForDigest = internalQuery({
  args: {},
  returns: v.array(orgValidator),
  handler: async (ctx) => {
    return await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

/** Internal: get single org by ID — used by email actions. */
export const getByIdInternal = internalQuery({
  args: { organizationId: v.id("organizations") },
  returns: v.union(orgValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.organizationId);
  },
});

/** Internal: get the email of the first admin in an org — used by email alerts. */
export const getOrgAdminEmailInternal = internalQuery({
  args: { organizationId: v.id("organizations") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const adminProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("orgRole"), "admin"))
      .first();
    if (!adminProfile) return null;
    const adminUser = await ctx.db.get(adminProfile.userId);
    return adminUser?.email ?? null;
  },
});
