import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireOrgAdmin } from "./lib/auth";

/** Count working days (Mon–Fri) between two YYYY-MM-DD strings (inclusive). */
function workingDaysInRange(startDate: string, endDate: string): number {
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

const staffReportItemValidator = v.object({
  staffUserId: v.id("users"),
  staffName: v.string(),
  email: v.string(),
  department: v.union(v.string(), v.null()),
  workingDays: v.number(),
  presentDays: v.number(),
  onTimeDays: v.number(),
  lateDays: v.number(),
  absentDays: v.number(),
  totalHours: v.union(v.number(), v.null()),
  avgHoursPerDay: v.union(v.number(), v.null()),
});

/** Org-wide attendance report for a date range. */
export const getOrgAttendanceReport = query({
  args: {
    organizationId: v.id("organizations"),
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.string(),   // YYYY-MM-DD
  },
  returns: v.object({
    startDate: v.string(),
    endDate: v.string(),
    workingDays: v.number(),
    staff: v.array(staffReportItemValidator),
    totals: v.object({
      totalStaff: v.number(),
      avgPresence: v.number(),
      totalLate: v.number(),
      totalAbsent: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    await requireOrgAdmin(ctx, args.organizationId);

    const profiles = await ctx.db
      .query("staffProfiles")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.neq(q.field("orgRole"), "admin"))
      .collect();

    const workingDays = workingDaysInRange(args.startDate, args.endDate);

    const staff = await Promise.all(
      profiles.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        const dept = profile.departmentId ? await ctx.db.get(profile.departmentId) : null;

        const logs = await ctx.db
          .query("attendanceLogs")
          .withIndex("by_staff", (q) => q.eq("staffUserId", profile.userId))
          .filter((q) =>
            q.and(
              q.gte(q.field("entryDate"), args.startDate),
              q.lte(q.field("entryDate"), args.endDate)
            )
          )
          .collect();

        const presentDays = logs.length;
        const lateDays = logs.filter((l) => l.late).length;
        const onTimeDays = presentDays - lateDays;
        const absentDays = Math.max(0, workingDays - presentDays);

        const logsWithHours = logs.filter((l) => l.hoursWorked !== undefined);
        const totalHours =
          logsWithHours.length > 0
            ? Math.round(logsWithHours.reduce((s, l) => s + (l.hoursWorked ?? 0), 0) * 100) / 100
            : null;
        const avgHoursPerDay =
          logsWithHours.length > 0
            ? Math.round((totalHours! / logsWithHours.length) * 100) / 100
            : null;

        return {
          staffUserId: profile.userId,
          staffName: user
            ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
            : "Unknown",
          email: user?.email ?? "",
          department: dept?.name ?? null,
          workingDays,
          presentDays,
          onTimeDays,
          lateDays,
          absentDays,
          totalHours,
          avgHoursPerDay,
        };
      })
    );

    const totalStaff = staff.length;
    const avgPresence =
      totalStaff > 0
        ? Math.round(
            (staff.reduce((s, r) => s + r.presentDays, 0) / (totalStaff * workingDays || 1)) * 100
          )
        : 0;
    const totalLate = staff.reduce((s, r) => s + r.lateDays, 0);
    const totalAbsent = staff.reduce((s, r) => s + r.absentDays, 0);

    return {
      startDate: args.startDate,
      endDate: args.endDate,
      workingDays,
      staff: staff.sort((a, b) => a.staffName.localeCompare(b.staffName)),
      totals: { totalStaff, avgPresence, totalLate, totalAbsent },
    };
  },
});
