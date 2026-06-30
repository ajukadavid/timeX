import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userRoles = v.union(
  v.literal("admin"),
  v.literal("manager"),
  v.literal("staff")
);

export const orgMemberRoles = v.union(
  v.literal("admin"),
  v.literal("staff")
);

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    fullName: v.optional(v.string()),
    role: userRoles,
    organizationName: v.optional(v.string()),
    isActive: v.boolean(),
    lastLoginAt: v.optional(v.number()),
    // Platform-level super admin (the TimeX operator)
    platformRole: v.optional(v.literal("superAdmin")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // ─── NEW: one row per company ─────────────────────────────────
  organizations: defineTable({
    name: v.string(),
    timezone: v.string(), // e.g. "Africa/Lagos"
    defaultSignInTime: v.optional(v.string()), // "HH:mm"
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_active", ["isActive"]),

  departments: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    employerId: v.id("users"), // legacy — still required for old records
    organizationId: v.optional(v.id("organizations")), // NEW — set by migration + new creates
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_employer", ["employerId"])
    .index("by_organization", ["organizationId"])
    .index("by_name_employer", ["name", "employerId"]),

  staffProfiles: defineTable({
    userId: v.id("users"),
    employerId: v.id("users"), // legacy — still required for old records
    organizationId: v.optional(v.id("organizations")), // NEW
    orgRole: v.optional(orgMemberRoles), // NEW: "admin" | "staff" within the org
    departmentId: v.optional(v.id("departments")),
    jobTitle: v.string(),
    employmentStatus: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended")
    ),
    timezone: v.optional(v.string()),
    startDate: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_employer", ["employerId"])
    .index("by_organization", ["organizationId"])
    .index("by_org_and_user", ["organizationId", "userId"])
    .index("by_department", ["departmentId"]),

  attendanceLogs: defineTable({
    staffUserId: v.id("users"),
    employerId: v.id("users"), // legacy
    organizationId: v.optional(v.id("organizations")), // NEW
    staffProfileId: v.id("staffProfiles"),
    entryTime: v.number(),
    entryDate: v.string(), // YYYY-MM-DD
    late: v.boolean(),
    source: v.optional(
      v.union(v.literal("web"), v.literal("mobile"), v.literal("import"))
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_staff", ["staffUserId"])
    .index("by_staff_date", ["staffUserId", "entryDate"])
    .index("by_employer_date", ["employerId", "entryDate"])
    .index("by_org_date", ["organizationId", "entryDate"]),

  employerSettings: defineTable({
    employerId: v.id("users"), // legacy
    organizationId: v.optional(v.id("organizations")), // NEW
    defaultSignInTime: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_employer", ["employerId"])
    .index("by_organization", ["organizationId"]),

  // Raw legacy collections (MongoDB migration audit).
  employers: defineTable({
    mongoId: v.optional(v.string()),
    clerkId: v.optional(v.string()),
    email: v.string(),
    companyName: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  staffs: defineTable({
    mongoId: v.optional(v.string()),
    clerkId: v.optional(v.string()),
    employerId: v.optional(v.string()),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_employer", ["employerId"]),

  employees: defineTable({
    mongoId: v.optional(v.string()),
    staffId: v.optional(v.string()),
    employerId: v.optional(v.string()),
    department: v.optional(v.string()),
    position: v.optional(v.string()),
    salary: v.optional(v.number()),
    startDate: v.optional(v.string()),
  }).index("by_employer", ["employerId"]),

  stafflogs: defineTable({
    mongoId: v.optional(v.string()),
    staffId: v.optional(v.string()),
    employerId: v.optional(v.string()),
    action: v.optional(v.string()),
    timestamp: v.optional(v.number()),
    details: v.optional(v.string()),
  })
    .index("by_staff", ["staffId"])
    .index("by_employer", ["employerId"]),
});
