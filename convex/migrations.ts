import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const insertEmployer = mutation({
  args: {
    mongoId: v.optional(v.string()),
    clerkId: v.optional(v.string()),
    email: v.string(),
    companyName: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("employers", { ...args });
  },
});

export const insertStaff = mutation({
  args: {
    mongoId: v.optional(v.string()),
    clerkId: v.optional(v.string()),
    employerId: v.optional(v.string()),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("staffs", { ...args });
  },
});

export const insertEmployee = mutation({
  args: {
    mongoId: v.optional(v.string()),
    staffId: v.optional(v.string()),
    employerId: v.optional(v.string()),
    department: v.optional(v.string()),
    position: v.optional(v.string()),
    salary: v.optional(v.number()),
    startDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("employees", { ...args });
  },
});

export const insertStafflog = mutation({
  args: {
    mongoId: v.optional(v.string()),
    staffId: v.optional(v.string()),
    employerId: v.optional(v.string()),
    action: v.optional(v.string()),
    timestamp: v.optional(v.number()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stafflogs", { ...args });
  },
});
