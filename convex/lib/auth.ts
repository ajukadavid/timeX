import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { ROLE } from "../roles";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Resolve the Convex user for the signed-in Clerk identity (includes legacy import rows). */
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

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireCurrentUser(ctx);
  if (user.role !== ROLE.ADMIN) {
    throw new Error("Admin access required");
  }
  return user;
}

/** Admin must own the employer record they are acting on. */
export async function requireEmployerAdmin(
  ctx: QueryCtx | MutationCtx,
  employerId: Id<"users">
) {
  const user = await requireAdmin(ctx);
  if (user._id !== employerId) {
    throw new Error("Unauthorized: employer mismatch");
  }
  return user;
}

/** Staff can read their own data; admins can read staff they employ. */
export async function requireStaffAccess(
  ctx: QueryCtx | MutationCtx,
  staffUserId: Id<"users">
) {
  const user = await requireCurrentUser(ctx);
  if (user._id === staffUserId) return user;

  if (user.role === ROLE.ADMIN) {
    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", staffUserId))
      .unique();
    if (profile?.employerId === user._id) return user;
  }

  throw new Error("Unauthorized");
}
