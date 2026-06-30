import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireCurrentUser, requireOrgAdmin, requireStaffAccess } from "./lib/auth";

// ─── Validators ───────────────────────────────────────────────

export const leaveRequestValidator = v.object({
  _id: v.id("leaveRequests"),
  _creationTime: v.number(),
  staffUserId: v.id("users"),
  organizationId: v.optional(v.id("organizations")),
  employerId: v.optional(v.id("users")),
  type: v.union(v.literal("annual"), v.literal("sick"), v.literal("other")),
  startDate: v.string(),
  endDate: v.string(),
  reason: v.optional(v.string()),
  status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
  reviewedBy: v.optional(v.id("users")),
  reviewedAt: v.optional(v.number()),
  reviewNote: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

function businessDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate + "T00:00:00Z");
  const end = new Date(endDate + "T00:00:00Z");
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getUTCDay();
    if (day !== 0 && day !== 6) count++;
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return count;
}

// ─── Staff mutations ───────────────────────────────────────────

/** Staff submits a leave request. */
export const requestLeave = mutation({
  args: {
    type: v.union(v.literal("annual"), v.literal("sick"), v.literal("other")),
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.string(),   // YYYY-MM-DD
    reason: v.optional(v.string()),
  },
  returns: v.id("leaveRequests"),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    if (args.startDate > args.endDate) {
      throw new Error("Start date must be before or equal to end date");
    }

    const profile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!profile) throw new Error("No staff profile found");

    const now = Date.now();
    return await ctx.db.insert("leaveRequests", {
      staffUserId: user._id,
      organizationId: profile.organizationId,
      employerId: profile.employerId,
      type: args.type,
      startDate: args.startDate,
      endDate: args.endDate,
      reason: args.reason,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Staff cancels their own pending request. */
export const cancelLeave = mutation({
  args: { requestId: v.id("leaveRequests") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const req = await ctx.db.get(args.requestId);
    if (!req) throw new Error("Leave request not found");
    if (req.staffUserId !== user._id) throw new Error("Not your leave request");
    if (req.status !== "pending") throw new Error("Can only cancel pending requests");

    await ctx.db.patch(args.requestId, {
      status: "rejected",
      reviewNote: "Cancelled by staff",
      reviewedAt: Date.now(),
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─── Staff queries ─────────────────────────────────────────────

/** Staff views their own leave requests. */
export const listMyLeaveRequests = query({
  args: {},
  returns: v.array(leaveRequestValidator),
  handler: async (ctx, _args) => {
    const user = await requireCurrentUser(ctx);
    return await ctx.db
      .query("leaveRequests")
      .withIndex("by_staff", (q) => q.eq("staffUserId", user._id))
      .order("desc")
      .collect();
  },
});

// ─── Admin queries / mutations ─────────────────────────────────

/** Org admin views all leave requests for their org. */
export const listOrgLeaveRequests = query({
  args: {
    organizationId: v.id("organizations"),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
  },
  returns: v.array(
    v.object({
      ...leaveRequestValidator.fields,
      staffName: v.string(),
      daysRequested: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);

    const requests = args.status
      ? await ctx.db
          .query("leaveRequests")
          .withIndex("by_org_status", (q) =>
            q.eq("organizationId", args.organizationId).eq("status", args.status!)
          )
          .order("desc")
          .collect()
      : await ctx.db
          .query("leaveRequests")
          .withIndex("by_organization", (q) =>
            q.eq("organizationId", args.organizationId)
          )
          .order("desc")
          .collect();

    return await Promise.all(
      requests.map(async (req) => {
        const user = await ctx.db.get(req.staffUserId);
        const staffName = user
          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
          : "Unknown";
        return {
          ...req,
          staffName,
          daysRequested: businessDaysBetween(req.startDate, req.endDate),
        };
      })
    );
  },
});

/** Returns count of pending leave requests for badge display. */
export const getPendingLeaveCount = query({
  args: { organizationId: v.id("organizations") },
  returns: v.number(),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    const pending = await ctx.db
      .query("leaveRequests")
      .withIndex("by_org_status", (q) =>
        q.eq("organizationId", args.organizationId).eq("status", "pending")
      )
      .collect();
    return pending.length;
  },
});

/** View a single staff member's leave requests (for staff detail page). */
export const listStaffLeaveRequests = query({
  args: { staffUserId: v.id("users") },
  returns: v.array(
    v.object({
      ...leaveRequestValidator.fields,
      daysRequested: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    await requireStaffAccess(ctx, args.staffUserId);
    const requests = await ctx.db
      .query("leaveRequests")
      .withIndex("by_staff", (q) => q.eq("staffUserId", args.staffUserId))
      .order("desc")
      .collect();
    return requests.map((req) => ({
      ...req,
      daysRequested: businessDaysBetween(req.startDate, req.endDate),
    }));
  },
});

/** Admin approves or rejects a leave request. */
export const reviewLeave = mutation({
  args: {
    requestId: v.id("leaveRequests"),
    decision: v.union(v.literal("approved"), v.literal("rejected")),
    reviewNote: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireCurrentUser(ctx);
    const req = await ctx.db.get(args.requestId);
    if (!req) throw new Error("Leave request not found");

    if (req.organizationId) {
      await requireOrgAdmin(ctx, req.organizationId);
    }

    await ctx.db.patch(args.requestId, {
      status: args.decision,
      reviewedBy: me._id,
      reviewedAt: Date.now(),
      reviewNote: args.reviewNote,
      updatedAt: Date.now(),
    });
    return null;
  },
});
