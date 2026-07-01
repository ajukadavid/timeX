#!/usr/bin/env node
import { MongoClient } from "mongodb";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { getConvexUrl, loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const convexUrl = getConvexUrl();

const requiredEnv = ["MONGODB_URI", "MONGODB_DB_NAME"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}

if (!convexUrl) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL or CONVEX_URL");
  process.exit(1);
}

const collections = {
  employers: process.env.MONGO_EMPLOYERS_COLLECTION || "employers",
  staffs: process.env.MONGO_STAFFS_COLLECTION || "staffs",
  departments: process.env.MONGO_DEPARTMENTS_COLLECTION || "departments",
  attendance: process.env.MONGO_ATTENDANCE_COLLECTION || "attendanceLogs",
};

function toRole(role) {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "manager") return "manager";
  return "staff";
}

function safeEmail(email, fallbackPrefix, id) {
  if (email && String(email).includes("@")) return String(email).toLowerCase();
  return `${fallbackPrefix}.${id}@legacy.logasiko.local`;
}

async function main() {
  const mongo = new MongoClient(process.env.MONGODB_URI);
  const convex = new ConvexHttpClient(convexUrl);

  await mongo.connect();
  const db = mongo.db(process.env.MONGODB_DB_NAME);

  try {
    console.log("Starting MongoDB -> Convex migration...");

    const employers = await db.collection(collections.employers).find({}).toArray();
    const staffs = await db.collection(collections.staffs).find({}).toArray();
    const departments = await db.collection(collections.departments).find({}).toArray();
    const attendance = await db.collection(collections.attendance).find({}).toArray();

    const userIdByLegacyId = new Map();
    const employerConvexIdByLegacyId = new Map();
    const departmentConvexIdByLegacyId = new Map();
    const staffProfileIdByLegacyStaffId = new Map();

    for (const employer of employers) {
      const sourceId = String(employer._id);
      const email = safeEmail(employer.email, "employer", sourceId);
      const userId = await convex.mutation(api.users.upsertLegacyUser, {
        sourceId,
        email,
        firstName: employer.firstName || undefined,
        lastName: employer.lastName || undefined,
        fullName:
          `${employer.firstName || ""} ${employer.lastName || ""}`.trim() ||
          undefined,
        role: "admin",
        organizationName: employer.companyName || undefined,
      });
      userIdByLegacyId.set(sourceId, userId);
      employerConvexIdByLegacyId.set(sourceId, userId);
    }

    for (const staff of staffs) {
      const sourceId = String(staff._id);
      const email = safeEmail(staff.email, "staff", sourceId);
      const userId = await convex.mutation(api.users.upsertLegacyUser, {
        sourceId,
        email,
        firstName: staff.firstName || undefined,
        lastName: staff.lastName || undefined,
        fullName:
          `${staff.firstName || ""} ${staff.lastName || ""}`.trim() || undefined,
        role: toRole(staff.role),
      });
      userIdByLegacyId.set(sourceId, userId);
    }

    for (const department of departments) {
      const sourceId = String(department._id);
      const legacyEmployerId = String(department.employer || department.employerId || "");
      const employerId = employerConvexIdByLegacyId.get(legacyEmployerId);
      if (!employerId) continue;

      const departmentId = await convex.mutation(api.departments.createDepartment, {
        employerId,
        name: department.name || "General",
        description: department.description || undefined,
      });
      departmentConvexIdByLegacyId.set(sourceId, departmentId);
    }

    for (const staff of staffs) {
      const legacyStaffId = String(staff._id);
      const userId = userIdByLegacyId.get(legacyStaffId);
      const legacyEmployerId = String(staff.employer || staff.employerId || "");
      const employerId = employerConvexIdByLegacyId.get(legacyEmployerId);

      if (!userId || !employerId) continue;

      const legacyDepartmentId = String(staff.department || staff.departmentId || "");
      const departmentId = departmentConvexIdByLegacyId.get(legacyDepartmentId);
      const profileId = await convex.mutation(api.staff.createStaffProfile, {
        employerId,
        userId,
        departmentId,
        jobTitle: staff.role || "Staff",
        startDate: staff.startDate || undefined,
        timezone: staff.timezone || undefined,
      });
      staffProfileIdByLegacyStaffId.set(legacyStaffId, profileId);
    }

    for (const log of attendance) {
      const legacyStaffId = String(log.staff || log.staffId || "");
      const legacyEmployerId = String(log.employer || log.employerId || "");
      const staffUserId = userIdByLegacyId.get(legacyStaffId);
      const employerId = employerConvexIdByLegacyId.get(legacyEmployerId);
      const staffProfileId = staffProfileIdByLegacyStaffId.get(legacyStaffId);

      if (!staffUserId || !employerId || !staffProfileId) continue;

      const entryTime = log.entryTime ? new Date(log.entryTime).getTime() : Date.now();
      await convex.mutation(api.attendance.logEntry, {
        employerId,
        staffUserId,
        staffProfileId,
        entryTime,
        late: Boolean(log.late),
        source: "import",
        notes: "Imported from MongoDB",
      });
    }

    console.log("Migration complete.");
    console.log(
      `Imported employers=${employers.length}, staffs=${staffs.length}, departments=${departments.length}, attendance=${attendance.length}`
    );
  } finally {
    await mongo.close();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
