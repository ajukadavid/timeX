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
  defaultSignInTime: v.optional(v.string()),
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

export const updateDepartment = mutation({
  args: {
    departmentId: v.id("departments"),
    name: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const dept = await ctx.db.get(args.departmentId);
    if (!dept) throw new Error("Department not found");

    if (dept.organizationId) {
      await requireOrgAdmin(ctx, dept.organizationId);
    } else {
      await requireEmployerAdmin(ctx, dept.employerId);
    }

    await ctx.db.patch(args.departmentId, {
      name: args.name.trim(),
      updatedAt: Date.now(),
    });
    return null;
  },
});

/** Update per-department sign-in time override. */
export const updateDepartmentSignInTime = mutation({
  args: {
    departmentId: v.id("departments"),
    defaultSignInTime: v.union(v.string(), v.null()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const dept = await ctx.db.get(args.departmentId);
    if (!dept) throw new Error("Department not found");

    if (dept.organizationId) {
      await requireOrgAdmin(ctx, dept.organizationId);
    } else {
      await requireEmployerAdmin(ctx, dept.employerId);
    }

    await ctx.db.patch(args.departmentId, {
      defaultSignInTime: args.defaultSignInTime ?? undefined,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const deleteDepartment = mutation({
  args: {
    departmentId: v.id("departments"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const dept = await ctx.db.get(args.departmentId);
    if (!dept) throw new Error("Department not found");

    if (dept.organizationId) {
      await requireOrgAdmin(ctx, dept.organizationId);
    } else {
      await requireEmployerAdmin(ctx, dept.employerId);
    }

    // Unlink any staff profiles that reference this department
    const profiles = await ctx.db
      .query("staffProfiles")
      .withIndex("by_department", (q) => q.eq("departmentId", args.departmentId))
      .collect();
    for (const profile of profiles) {
      await ctx.db.patch(profile._id, {
        departmentId: undefined,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.delete(args.departmentId);
    return null;
  },
});
