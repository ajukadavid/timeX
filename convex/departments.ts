import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireEmployerAdmin } from "./lib/auth";

const departmentValidator = v.object({
  _id: v.id("departments"),
  _creationTime: v.number(),
  name: v.string(),
  description: v.optional(v.string()),
  employerId: v.id("users"),
  isActive: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const listByEmployer = query({
  args: { employerId: v.id("users") },
  returns: v.array(departmentValidator),
  handler: async (ctx, args) => {
    await requireEmployerAdmin(ctx, args.employerId);
    return await ctx.db
      .query("departments")
      .withIndex("by_employer", (q) => q.eq("employerId", args.employerId))
      .collect();
  },
});

export const createDepartment = mutation({
  args: {
    employerId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  returns: v.id("departments"),
  handler: async (ctx, args) => {
    await requireEmployerAdmin(ctx, args.employerId);
    const now = Date.now();

    return await ctx.db.insert("departments", {
      name: args.name,
      description: args.description,
      employerId: args.employerId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});
