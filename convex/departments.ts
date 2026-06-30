import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireEmployerAdmin, requireOrgAdmin } from "./lib/auth";

const departmentValidator = v.object({
  _id: v.id("departments"),
  _creationTime: v.number(),
  name: v.string(),
  description: v.optional(v.string()),
  employerId: v.id("users"),
  organizationId: v.optional(v.id("organizations")),
  isActive: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
});

/** List departments by org (new model). */
export const listByOrg = query({
  args: { organizationId: v.id("organizations") },
  returns: v.array(departmentValidator),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    return await ctx.db
      .query("departments")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();
  },
});

/** Create department in org (new model). */
export const createDepartmentInOrg = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  returns: v.id("departments"),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);
    const now = Date.now();

    // Find admin's userId for backward-compat employerId field
    const adminProfile = await ctx.db
      .query("staffProfiles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("orgRole"), "admin"))
      .first();

    const placeholderUserId = adminProfile?.userId;
    if (!placeholderUserId) throw new Error("No admin found for this org");

    return await ctx.db.insert("departments", {
      name: args.name,
      description: args.description,
      employerId: placeholderUserId,
      organizationId: args.organizationId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
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
