#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { getConvexUrl, loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const convexUrl = getConvexUrl();
if (!convexUrl) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL or CONVEX_URL");
  process.exit(1);
}

const EXPORTS_DIR = process.env.EXPORTS_DIR || "./exports";
const client = new ConvexHttpClient(convexUrl);

function readJson(fileName) {
  return JSON.parse(readFileSync(`${EXPORTS_DIR}/${fileName}`, "utf8"));
}

function getMongoId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.$oid) return String(value.$oid);
  return String(value);
}

function toMillis(value) {
  if (!value) return Date.now();
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Date.parse(value);
    return Number.isNaN(n) ? Date.now() : n;
  }
  if (typeof value === "object" && value.$date) {
    const d = value.$date;
    if (typeof d === "number") return d;
    const n = Date.parse(String(d));
    return Number.isNaN(n) ? Date.now() : n;
  }
  return Date.now();
}

function safeEmail(email, prefix, id) {
  if (email && String(email).includes("@")) return String(email).toLowerCase();
  return `${prefix}.${id}@legacy.logasiko.local`;
}

function normalizeRole(role) {
  const r = String(role || "").toLowerCase();
  if (r === "admin") return "admin";
  if (r === "manager") return "manager";
  return "staff";
}

async function run() {
  console.log("Starting export -> Convex migration...");

  const departments = readJson("departments.json");
  const employees = readJson("employees.json");
  const employers = readJson("employers.json");
  const stafflogs = readJson("stafflogs.json");
  const staffs = readJson("staffs.json");

  const employerMap = new Map(); // mongo employer id -> convex users _id
  const staffUserMap = new Map(); // mongo staff id -> convex users _id
  const departmentMap = new Map(); // mongo dept id -> convex departments _id
  const staffProfileMap = new Map(); // mongo staff id -> convex staffProfiles _id

  // 1) Employers: raw + normalized users(admin)
  for (const doc of employers) {
    const mongoId = getMongoId(doc._id);
    const email = safeEmail(doc.email, "employer", mongoId);

    await client.mutation(api.migrations.insertEmployer, {
      mongoId,
      clerkId: doc.clerkId || undefined,
      email,
      companyName: doc.companyName || undefined,
      createdAt: toMillis(doc.createdAt),
    });

    const employerUserId = await client.mutation(api.users.upsertLegacyUser, {
      sourceId: mongoId,
      email,
      firstName: doc.firstName || undefined,
      lastName: doc.lastName || undefined,
      fullName:
        `${doc.firstName || ""} ${doc.lastName || ""}`.trim() || undefined,
      role: "admin",
      organizationName: doc.companyName || undefined,
      isActive: true,
    });
    employerMap.set(mongoId, employerUserId);
  }
  console.log(`Migrated employers: ${employers.length}`);

  // 2) Staffs: raw + normalized users(staff/manager)
  for (const doc of staffs) {
    const mongoId = getMongoId(doc._id);
    const email = safeEmail(doc.email, "staff", mongoId);
    const mongoEmployerId = getMongoId(doc.employer || doc.employerId);

    await client.mutation(api.migrations.insertStaff, {
      mongoId,
      clerkId: doc.clerkId || undefined,
      employerId: mongoEmployerId || undefined,
      email,
      firstName: doc.firstName || undefined,
      lastName: doc.lastName || undefined,
      role: doc.role || undefined,
      createdAt: toMillis(doc.createdAt),
    });

    const staffUserId = await client.mutation(api.users.upsertLegacyUser, {
      sourceId: mongoId,
      email,
      firstName: doc.firstName || undefined,
      lastName: doc.lastName || undefined,
      fullName:
        `${doc.firstName || ""} ${doc.lastName || ""}`.trim() || undefined,
      role: normalizeRole(doc.role),
      isActive: true,
    });

    staffUserMap.set(mongoId, staffUserId);
  }
  console.log(`Migrated staffs: ${staffs.length}`);

  // 3) Departments: normalized only (needs convex employerId)
  for (const doc of departments) {
    const mongoId = getMongoId(doc._id);
    const mongoEmployerId = getMongoId(doc.employer || doc.employerId);
    const employerId = employerMap.get(mongoEmployerId);
    if (!employerId) continue;

    const departmentId = await client.mutation(api.departments.createDepartment, {
      employerId,
      name: String(doc.name || "General"),
      description: doc.description || undefined,
    });
    departmentMap.set(mongoId, departmentId);
  }
  console.log(`Migrated departments (normalized): ${departmentMap.size}`);

  // 4) Staff profiles: normalized linkage
  for (const doc of staffs) {
    const mongoStaffId = getMongoId(doc._id);
    const mongoEmployerId = getMongoId(doc.employer || doc.employerId);
    const mongoDepartmentId = getMongoId(doc.department || doc.departmentId);
    const userId = staffUserMap.get(mongoStaffId);
    const employerId = employerMap.get(mongoEmployerId);
    if (!userId || !employerId) continue;

    const profileId = await client.mutation(api.staff.createStaffProfile, {
      userId,
      employerId,
      departmentId: departmentMap.get(mongoDepartmentId),
      jobTitle: String(doc.role || "Staff"),
      timezone: doc.timezone || undefined,
      startDate: doc.startDate || undefined,
    });
    staffProfileMap.set(mongoStaffId, profileId);
  }
  console.log(`Migrated staffProfiles (normalized): ${staffProfileMap.size}`);

  // 5) Employees: raw archive table
  for (const doc of employees) {
    await client.mutation(api.migrations.insertEmployee, {
      mongoId: getMongoId(doc._id) || undefined,
      staffId: getMongoId(doc.staffId || doc.staff) || undefined,
      employerId: getMongoId(doc.employerId || doc.employer) || undefined,
      department: doc.department || undefined,
      position: doc.position || undefined,
      salary: typeof doc.salary === "number" ? doc.salary : undefined,
      startDate: doc.startDate || undefined,
    });
  }
  console.log(`Migrated employees (raw): ${employees.length}`);

  // 6) Stafflogs: raw + normalized attendance (best effort)
  for (const doc of stafflogs) {
    const staffMongoId = getMongoId(doc.staffId || doc.staff);
    const employerMongoId = getMongoId(doc.employerId || doc.employer);
    const timestamp = toMillis(doc.timestamp || doc.entryTime || doc.createdAt);

    await client.mutation(api.migrations.insertStafflog, {
      mongoId: getMongoId(doc._id) || undefined,
      staffId: staffMongoId || undefined,
      employerId: employerMongoId || undefined,
      action: doc.action || undefined,
      timestamp,
      details: doc.details || undefined,
    });

    const staffUserId = staffUserMap.get(staffMongoId);
    const employerId = employerMap.get(employerMongoId);
    const staffProfileId = staffProfileMap.get(staffMongoId);
    if (!staffUserId || !employerId || !staffProfileId) continue;

    const actionText = String(doc.action || doc.details || "").toLowerCase();
    const late =
      doc.late === true ||
      actionText.includes("late") ||
      actionText.includes("clock in late");

    await client.mutation(api.attendance.logEntry, {
      employerId,
      staffUserId,
      staffProfileId,
      entryTime: timestamp,
      late,
      source: "import",
      notes: doc.details || doc.action || "Imported from Mongo stafflogs",
    });
  }
  console.log(`Migrated stafflogs (raw): ${stafflogs.length}`);

  console.log("Migration complete.");
}

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
