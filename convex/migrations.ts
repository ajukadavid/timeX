/**
 * One-time migration: create organizations from existing admin users.
 *
 * Run via:
 *   npx convex run migrations:migrateToOrganizations --prod
 *
 * Safe to re-run — idempotent (checks for existing organizationId before acting).
 */
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { ROLE } from "./roles";
import type { Id } from "./_generated/dataModel";

export const migrateToOrganizations = internalMutation({
  args: {},
  returns: v.object({
    orgsCreated: v.number(),
    profilesUpdated: v.number(),
    departmentsUpdated: v.number(),
    attendanceUpdated: v.number(),
    settingsUpdated: v.number(),
  }),
  handler: async (ctx) => {
    const now = Date.now();
    let orgsCreated = 0;
    let profilesUpdated = 0;
    let departmentsUpdated = 0;
    let attendanceUpdated = 0;
    let settingsUpdated = 0;

    // Find all admin users
    const adminUsers = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", ROLE.ADMIN))
      .collect();

    for (const admin of adminUsers) {
      // ── 1. Find or create an organization for this admin ──────────
      let orgId: Id<"organizations">;

      // Check if admin already has an admin staffProfile pointing to an org
      const existingAdminProfile = await ctx.db
        .query("staffProfiles")
        .withIndex("by_user", (q) => q.eq("userId", admin._id))
        .filter((q) => q.eq(q.field("orgRole"), "admin"))
        .first();

      if (existingAdminProfile?.organizationId) {
        orgId = existingAdminProfile.organizationId;
      } else {
        // Create a new org from the admin's data
        const orgName =
          admin.organizationName ??
          `${admin.firstName ?? admin.email.split("@")[0]}'s Company`;

        orgId = await ctx.db.insert("organizations", {
          name: orgName,
          timezone: "Africa/Lagos",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });
        orgsCreated++;

        // Create or update admin's own staffProfile in the org
        const adminSelfProfile = await ctx.db
          .query("staffProfiles")
          .withIndex("by_user", (q) => q.eq("userId", admin._id))
          .first();

        if (adminSelfProfile) {
          await ctx.db.patch(adminSelfProfile._id, {
            organizationId: orgId,
            orgRole: "admin",
            updatedAt: now,
          });
        } else {
          await ctx.db.insert("staffProfiles", {
            userId: admin._id,
            employerId: admin._id,
            organizationId: orgId,
            orgRole: "admin",
            jobTitle: "Organization Admin",
            employmentStatus: "active",
            createdAt: now,
            updatedAt: now,
          });
        }
        profilesUpdated++;
      }

      // ── 2. Update staff profiles belonging to this admin ──────────
      const staffProfiles = await ctx.db
        .query("staffProfiles")
        .withIndex("by_employer", (q) => q.eq("employerId", admin._id))
        .collect();

      for (const profile of staffProfiles) {
        if (profile.organizationId) continue; // already migrated
        await ctx.db.patch(profile._id, {
          organizationId: orgId,
          orgRole: profile.userId === admin._id ? "admin" : "staff",
          updatedAt: now,
        });
        profilesUpdated++;
      }

      // ── 3. Update departments ─────────────────────────────────────
      const departments = await ctx.db
        .query("departments")
        .withIndex("by_employer", (q) => q.eq("employerId", admin._id))
        .collect();

      for (const dept of departments) {
        if (dept.organizationId) continue;
        await ctx.db.patch(dept._id, {
          organizationId: orgId,
          updatedAt: now,
        });
        departmentsUpdated++;
      }

      // ── 4. Update attendance logs ─────────────────────────────────
      const logs = await ctx.db
        .query("attendanceLogs")
        .withIndex("by_employer_date", (q) => q.eq("employerId", admin._id))
        .collect();

      for (const log of logs) {
        if (log.organizationId) continue;
        await ctx.db.patch(log._id, {
          organizationId: orgId,
          updatedAt: now,
        });
        attendanceUpdated++;
      }

      // ── 5. Update employer settings ───────────────────────────────
      const settings = await ctx.db
        .query("employerSettings")
        .withIndex("by_employer", (q) => q.eq("employerId", admin._id))
        .collect();

      for (const s of settings) {
        if (s.organizationId) continue;
        await ctx.db.patch(s._id, {
          organizationId: orgId,
          updatedAt: now,
        });
        settingsUpdated++;
      }

      // ── 6. Mirror defaultSignInTime from settings → org record ────
      const firstSetting = settings[0];
      if (firstSetting?.defaultSignInTime) {
        await ctx.db.patch(orgId, {
          defaultSignInTime: firstSetting.defaultSignInTime,
          updatedAt: now,
        });
      }
    }

    return {
      orgsCreated,
      profilesUpdated,
      departmentsUpdated,
      attendanceUpdated,
      settingsUpdated,
    };
  },
});
