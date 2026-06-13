import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireEmployerAdmin } from "./lib/auth";

const settingsValidator = v.object({
  _id: v.id("employerSettings"),
  _creationTime: v.number(),
  employerId: v.id("users"),
  defaultSignInTime: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
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
