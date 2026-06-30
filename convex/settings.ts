import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireEmployerAdmin, requireOrgAdmin } from "./lib/auth";

const settingsValidator = v.object({
  _id: v.id("employerSettings"),
  _creationTime: v.number(),
  employerId: v.id("users"),
  organizationId: v.optional(v.id("organizations")),
  defaultSignInTime: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

/** Get settings by org (new model). */
export const getOrgSettings = query({
  args: { organizationId: v.id("organizations") },
  returns: v.union(settingsValidator, v.null()),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    return await ctx.db
      .query("employerSettings")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();
  },
});

/** Update sign-in time for an org (new model). */
export const updateOrgSignInTime = mutation({
  args: {
    organizationId: v.id("organizations"),
    defaultSignInTime: v.string(),
  },
  returns: v.id("employerSettings"),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    const now = Date.now();

    const existing = await ctx.db
      .query("employerSettings")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        defaultSignInTime: args.defaultSignInTime,
        updatedAt: now,
      });
      // Mirror onto org record
      await ctx.db.patch(args.organizationId, {
        defaultSignInTime: args.defaultSignInTime,
        updatedAt: now,
      });
      return existing._id;
    }

    // Also update org record
    await ctx.db.patch(args.organizationId, {
      defaultSignInTime: args.defaultSignInTime,
      updatedAt: now,
    });

    const adminProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("orgRole"), "admin"))
      .first();

    return await ctx.db.insert("employerSettings", {
      employerId: adminProfile?.userId ?? ("" as never),
      organizationId: args.organizationId,
      defaultSignInTime: args.defaultSignInTime,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getEmployerSettings = query({
  args: {
    employerId: v.id("users"),
  },
  returns: v.union(settingsValidator, v.null()),
  handler: async (ctx, args) => {
    await requireEmployerAdmin(ctx, args.employerId);
    return await ctx.db
      .query("employerSettings")
      .withIndex("by_employer", (q) => q.eq("employerId", args.employerId))
      .unique();
  },
});

export const updateDefaultSignInTime = mutation({
  args: {
    employerId: v.id("users"),
    defaultSignInTime: v.string(),
  },
  returns: v.id("employerSettings"),
  handler: async (ctx, args) => {
    await requireEmployerAdmin(ctx, args.employerId);
    const now = Date.now();
    const existing = await ctx.db
      .query("employerSettings")
      .withIndex("by_employer", (q) => q.eq("employerId", args.employerId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        defaultSignInTime: args.defaultSignInTime,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("employerSettings", {
      employerId: args.employerId,
      defaultSignInTime: args.defaultSignInTime,
      createdAt: now,
      updatedAt: now,
    });
  },
});
