"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

function pad(n: number) { return n.toString().padStart(2, "0"); }
function isoDate(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ pct }: { pct: number }) {
  if (pct >= 95) return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono" style={{ backgroundColor: "#b0f0d6", color: "#0b513d" }}>Exceptional</span>;
  if (pct >= 85) return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono" style={{ backgroundColor: "#ebefec", color: "#404944" }}>Standard</span>;
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono" style={{ backgroundColor: "#ffdbd0", color: "#832600" }}>Needs Review</span>;
}

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const myAdminOrg = useQuery(api.organizations.getMyAdminOrg, isAuthenticated ? {} : "skip");
  const organizationId = myAdminOrg?._id ?? null;
  const isAllowed = me?.platformRole === "superAdmin" || me?.role === "admin" || me?.role === "manager";

  useEffect(() => {
    if (me === undefined) return;
    if (me === null) { router.replace("/login"); return; }
    if (!isAllowed) router.replace(`/dashboardStaff/${me._id}`);
  }, [me, isAllowed, router]);

  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [startDate, setStartDate] = useState(isoDate(firstOfMonth));
  const [endDate, setEndDate] = useState(isoDate(today));

  function setPreset(preset: "week" | "month" | "lastMonth") {
    const now = new Date();
    if (preset === "week") {
      const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      setStartDate(isoDate(mon)); setEndDate(isoDate(now));
    } else if (preset === "month") {
      setStartDate(isoDate(new Date(now.getFullYear(), now.getMonth(), 1))); setEndDate(isoDate(now));
    } else {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      setStartDate(isoDate(last)); setEndDate(isoDate(lastEnd));
    }
  }

  const report = useQuery(
    api.reports.getOrgAttendanceReport,
    isAuthenticated && organizationId && startDate && endDate
      ? { organizationId: organizationId as Id<"organizations">, startDate, endDate }
      : "skip"
  );

  function exportCSV() {
    if (!report) return;
    const headers = ["Name", "Email", "Department", "Working Days", "Present", "On Time", "Late", "Absent", "Total Hours", "Avg Hrs/Day"];
    const rows = report.staff.map((s) => [
      s.staffName, s.email, s.department ?? "", String(s.workingDays), String(s.presentDays),
      String(s.onTimeDays), String(s.lateDays), String(s.absentDays),
      s.totalHours != null ? String(s.totalHours) : "", s.avgHoursPerDay != null ? String(s.avgHoursPerDay) : "",
    ]);
    downloadCSV([headers, ...rows], `attendance-report-${startDate}-to-${endDate}.csv`);
  }

  if (!me || !isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6faf7" }}>
        <span className="material-symbols-outlined text-[48px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f6faf7" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: "#f6faf7", borderColor: "rgba(191,201,195,0.4)", boxShadow: "0 1px 12px rgba(6,78,59,0.04)" }}>
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboardEmployer")}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: "#707974" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="font-bold text-xl leading-none" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
                Attendance Reports
              </h1>
              {myAdminOrg && <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{myAdminOrg.name}</p>}
            </div>
          </div>
          <button
            onClick={exportCSV}
            disabled={!report}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-40"
            style={{ backgroundColor: "#ac3400", color: "#ffffff" }}
            onMouseEnter={(e) => { if (report) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Export CSV
          </button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
          <div className="flex flex-wrap gap-3 mb-5">
            {(["week", "month", "lastMonth"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className="px-4 py-1.5 rounded-lg border text-sm transition-all"
                style={{ borderColor: "rgba(191,201,195,0.5)", color: "#404944" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                {p === "week" ? "This Week" : p === "month" ? "This Month" : "Last Month"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Start Date</label>
              <input
                type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b", fontFamily: "var(--font-jetbrains, monospace)" }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>End Date</label>
              <input
                type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b", fontFamily: "var(--font-jetbrains, monospace)" }}
              />
            </div>
            <p className="text-xs" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
              {report ? `${report.workingDays} working day${report.workingDays !== 1 ? "s" : ""} (Mon–Fri)` : "Select a date range"}
            </p>
          </div>
        </div>

        {/* Summary bento cards */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Attendance % */}
            <div className="rounded-xl p-7 relative overflow-hidden" style={{ backgroundColor: "#064e3b" }}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs uppercase tracking-wider opacity-70" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#80bea6" }}>Attendance %</span>
                  <span className="material-symbols-outlined p-2 rounded-full" style={{ color: "#80bea6", backgroundColor: "rgba(255,255,255,0.1)", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <p className="text-5xl font-bold" style={{ color: "#ffffff", fontFamily: "var(--font-hanken, sans-serif)" }}>{report.totals.avgPresence}%</p>
                <p className="text-sm mt-2 opacity-70" style={{ color: "#80bea6" }}>Average across {report.totals.totalStaff} employees</p>
              </div>
              <div className="absolute bottom-0 right-0 opacity-10" style={{ transform: "translate(25%, 25%)" }}>
                <span className="material-symbols-outlined text-white" style={{ fontSize: "140px", fontVariationSettings: "'FILL' 1" }}>eco</span>
              </div>
            </div>
            {/* Total Staff */}
            <div className="rounded-xl p-7 border" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Total Staff</span>
                <span className="material-symbols-outlined p-2 rounded-full" style={{ color: "#003527", backgroundColor: "#b0f0d6", fontVariationSettings: "'FILL' 1" }}>group</span>
              </div>
              <p className="text-5xl font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>{report.totals.totalStaff}</p>
              <p className="text-sm mt-2" style={{ color: "#707974" }}>Employees in this period</p>
            </div>
            {/* Late count */}
            <div className="rounded-xl p-7 border" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Late Incidents</span>
                <span className="material-symbols-outlined p-2 rounded-full" style={{ color: "#ac3400", backgroundColor: "#ffdbd0", fontVariationSettings: "'FILL' 1" }}>history</span>
              </div>
              <p className="text-5xl font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>{report.totals.totalLate}</p>
              <div className="mt-5">
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#ebefec" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: "#ac3400",
                      width: `${Math.min(100, report.totals.totalStaff > 0 ? (report.totals.totalLate / (report.totals.totalStaff * (report.workingDays || 1))) * 100 : 0)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff table */}
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
          <div className="px-6 py-5 border-b flex justify-between items-center" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "#f6faf7" }}>
            <h3 className="font-bold text-base" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Staff Performance Breakdown</h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg transition-all" style={{ color: "#707974" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>

          {report === undefined ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[40px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
              <p className="text-sm" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Loading report…</p>
            </div>
          ) : report.staff.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[48px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>analytics</span>
              <p className="font-semibold" style={{ color: "#003527" }}>No data for this period</p>
              <p className="text-sm" style={{ color: "#707974" }}>No attendance records found between {startDate} and {endDate}.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: "rgba(241,245,242,0.6)", borderBottom: "1px solid rgba(191,201,195,0.2)" }}>
                      {["Employee", "Department", "Attendance", "Hours Logged", "Late Days", "Status"].map((h) => (
                        <th
                          key={h}
                          className={`px-6 py-4 ${h === "Hours Logged" || h === "Late Days" ? "text-right" : ""}`}
                          style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.06em", color: "#707974", textTransform: "uppercase" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.staff.map((s) => {
                      const presencePct = report.workingDays > 0
                        ? Math.round((s.presentDays / report.workingDays) * 100)
                        : 0;
                      return (
                        <tr
                          key={s.staffUserId as string}
                          className="border-b transition-colors"
                          style={{ borderColor: "rgba(191,201,195,0.15)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(246,250,247,0.6)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                                style={{ backgroundColor: "#b0f0d6", color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}
                              >
                                {s.staffName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-sm leading-none" style={{ color: "#003527" }}>{s.staffName}</p>
                                <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{s.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-sm" style={{ color: "#404944" }}>{s.department ?? <em style={{ color: "#bfc9c3" }}>—</em>}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#ebefec" }}>
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${presencePct}%`,
                                    backgroundColor: presencePct >= 85 ? "#003527" : presencePct >= 70 ? "#ac3400" : "#ba1a1a",
                                  }}
                                />
                              </div>
                              <span
                                className="text-xs font-mono font-bold"
                                style={{ color: presencePct >= 85 ? "#003527" : "#ac3400" }}
                              >
                                {presencePct}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="text-sm font-mono" style={{ color: "#003527" }}>
                              {s.totalHours != null ? `${s.totalHours}h` : "—"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span
                              className="text-sm font-mono font-bold"
                              style={{ color: s.lateDays > 0 ? "#ac3400" : "#707974" }}
                            >
                              {s.lateDays}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <StatusBadge pct={presencePct} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div
                className="px-6 py-4 border-t flex items-center justify-between"
                style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "rgba(241,245,242,0.4)" }}
              >
                <p className="text-xs" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                  {report.staff.length} employees · {report.workingDays} working days · {startDate} to {endDate}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
