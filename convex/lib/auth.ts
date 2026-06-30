import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { ROLE } from "../roles";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Resolve the Convex user for the signed-in Clerk identity. */
export async function resolveCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const byClerkId = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (byClerkId) return byClerkId;

  const email = identity.email ? normalizeEmail(identity.email) : null;
  if (!email) return null;

  const byEmail = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
  if (!byEmail) return null;

  if (byEmail.clerkId.startsWith("legacy:")) return byEmail;
  if (byEmail.clerkId === identity.subject) return byEmail;

  return null;
}

export async function requireCurrentUser(ctx: QueryCtx | MutationCtx) {
  const user = await resolveCurrentUser(ctx);
  if (!user) throw new Error("Not authenticated");
  return user;
}

/** Platform-level super admin (you). */
export async function requireSuperAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireCurrentUser(ctx);
  if (user.platformRole !== "superAdmin") {
    throw new Error("Super admin access required");
  }
  return user;
}

/**
 * Org admin check — caller must have an admin staffProfile in this org,
 * OR be the platform super admin.
 */
export async function requireOrgAdmin(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">
) {
  const user = await requireCurrentUser(ctx);
  if (user.platformRole === "superAdmin") return user;

  const profile = await ctx.db
    .query("staffProfiles")
    .withIndex("by_org_and_user", (q) =>
      q.eq("organizationId", organizationId).eq("userId", user._id)
    )
    .unique();

  if (!profile || profile.orgRole !== "admin") {
    throw new Error("Org admin access required");
  }
  return user;
}

/**
 * Legacy employer admin check (for backward compat with old employerId model).
 * Also accepts super admin and org-model admin.
 */
export async function requireEmployerAdmin(
  ctx: QueryCtx | MutationCtx,
  employerId: Id<"users">
) {
  const user = await requireCurrentUser(ctx);
  if (user.platformRole === "superAdmin") return user;

  // New org model: check if user is admin of the org linked to this employerId
  const legacyAdminProfile = await ctx.db
    .query("staffProfiles")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .filter((q) => q.eq(q.field("orgRole"), "admin"))
    .first();

  if (legacyAdminProfile?.organizationId) {
    // User is an org admin — verify the employerId belongs to same org
    const targetProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_employer", (q) => q.eq("employerId", employerId))
      .first();
    if (
      targetProfile?.organizationId === legacyAdminProfile.organizationId ||
      employerId === user._id
    ) {
      return user;
    }
  }

  // Legacy check: the caller IS the employer
  if (user._id !== employerId) {
    throw new Error("Unauthorized: employer mismatch");
  }
  if (user.role !== ROLE.ADMIN) {
    throw new Error("Admin access required");
  }
  return user;
}

/** Staff can read their own data; org admins and super admins can read any staff in their org. */
export async function requireStaffAccess(
  ctx: QueryCtx | MutationCtx,
  staffUserId: Id<"users">
) {
  const user = await requireCurrentUser(ctx);
  if (user._id === staffUserId) return user;
  if (user.platformRole === "superAdmin") return user;

  // Org model: caller is admin of the org the target belongs to
  const targetProfile = await ctx.db
    .query("staffProfiles")
    .withIndex("by_user", (q) => q.eq("userId", staffUserId))
    .first();

  if (targetProfile?.organizationId) {
    const callerProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_org_and_user", (q) =>
        q
          .eq("organizationId", targetProfile.organizationId!)
          .eq("userId", user._id)
      )
      .unique();
    if (callerProfile?.orgRole === "admin") return user;
  }

  // Legacy check
  if (user.role === ROLE.ADMIN) {
    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", staffUserId))
      .unique();
    if (profile?.employerId === user._id) return user;
  }

  throw new Error("Unauthorized");
}
