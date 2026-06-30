import { v } from "convex/values";
import { query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireOrgAdmin } from "./lib/auth";

// ─── Log helper (callable from any mutation) ──────────────────

export async function logAction(
  ctx: MutationCtx,
  data: {
    organizationId?: Id<"organizations">;
    adminId: Id<"users">;
    adminName: string;
    action: string;
    targetUserId?: Id<"users">;
    targetName?: string;
    details?: string;
  }
) {
  await ctx.db.insert("auditLogs", {
    ...data,
    createdAt: Date.now(),
  });
}

// ─── Validator ────────────────────────────────────────────────

const auditLogValidator = v.object({
  _id: v.id("auditLogs"),
  _creationTime: v.number(),
  organizationId: v.optional(v.id("organizations")),
  adminId: v.id("users"),
  adminName: v.string(),
  action: v.string(),
  targetUserId: v.optional(v.id("users")),
  targetName: v.optional(v.string()),
  details: v.optional(v.string()),
  createdAt: v.number(),
});

// ─── Human-readable action labels ─────────────────────────────

export const ACTION_LABELS: Record<string, string> = {
  manual_clock_in: "Manual clock-in added",
  delete_attendance: "Attendance entry deleted",
  role_change: "Staff role changed",
  delete_staff: "Staff member deleted",
  leave_approved: "Leave request approved",
  leave_rejected: "Leave request rejected",
  dept_deadline_updated: "Department sign-in time updated",
  notification_settings_updated: "Notification settings updated",
};

// ─── Queries ──────────────────────────────────────────────────

export const listOrgAuditLogs = query({
  args: {
    organizationId: v.id("organizations"),
    limit: v.optional(v.number()),
  },
  returns: v.array(auditLogValidator),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    const limit = Math.min(args.limit ?? 100, 500);
    return await ctx.db
      .query("auditLogs")
      .withIndex("by_org_created", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .take(limit);
  },
});
