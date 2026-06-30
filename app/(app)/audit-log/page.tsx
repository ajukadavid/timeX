"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const ACTION_LABELS: Record<string, string> = {
  manual_clock_in: "Manual Clock-In",
  delete_attendance: "Attendance Deleted",
  role_change: "Role Change",
  delete_staff: "Staff Deleted",
  leave_approved: "Leave Approved",
  leave_rejected: "Leave Rejected",
  dept_deadline_updated: "Dept Time Updated",
  notification_settings_updated: "Notifications Updated",
};

const ACTION_STYLES: Record<string, { bg: string; color: string }> = {
  manual_clock_in: { bg: "#064e3b", color: "#80bea6" },
  delete_attendance: { bg: "#ffdad6", color: "#93000a" },
  role_change: { bg: "#ffdbd0", color: "#832600" },
  delete_staff: { bg: "#ffdad6", color: "#93000a" },
  leave_approved: { bg: "#b0f0d6", color: "#0b513d" },
  leave_rejected: { bg: "#ffdbd0", color: "#832600" },
  dept_deadline_updated: { bg: "#ebefec", color: "#404944" },
  notification_settings_updated: { bg: "#ebefec", color: "#404944" },
};

function ActionBadge({ action }: { action: string }) {
  const style = ACTION_STYLES[action] ?? { bg: "#ebefec", color: "#404944" };
  return (
    <span
      className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wide"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {ACTION_LABELS[action] ?? action}
    </span>
  );
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0] ?? "").slice(0, 2).join("").toUpperCase();
}

const AVATAR_COLORS = ["#064e3b", "#2c4d00", "#ac3400", "#003527", "#707974"];

export default function AuditLogPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const myAdminOrg = useQuery(api.organizations.getMyAdminOrg, isAuthenticated ? {} : "skip");
  const organizationId = myAdminOrg?._id ?? null;
  const isAllowed = me?.platformRole === "superAdmin" || me?.role === "admin";

  useEffect(() => {
    if (me === undefined) return;
    if (me === null) { router.replace("/login"); return; }
    if (!isAllowed) router.replace(`/dashboardStaff/${me._id}`);
  }, [me, isAllowed, router]);

  const [limit, setLimit] = useState(100);
  const [search, setSearch] = useState("");

  const logs = useQuery(
    api.audit.listOrgAuditLogs,
    isAuthenticated && organizationId
      ? { organizationId: organizationId as Id<"organizations">, limit }
      : "skip"
  );

  const filteredLogs = (logs ?? []).filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.adminName.toLowerCase().includes(q) ||
      (l.targetName ?? "").toLowerCase().includes(q) ||
      (ACTION_LABELS[l.action] ?? l.action).toLowerCase().includes(q)
    );
  });

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
      <header
        className="sticky top-0 z-40 border-b"
        style={{ backgroundColor: "#f6faf7", borderColor: "rgba(191,201,195,0.4)", boxShadow: "0 1px 12px rgba(6,78,59,0.04)" }}
      >
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
                Audit Log
              </h1>
              {myAdminOrg && (
                <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                  {myAdminOrg.name}
                </p>
              )}
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: "#707974" }}>search</span>
            <input
              type="text"
              placeholder="Search logs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none border"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(191,201,195,0.5)",
                color: "#181d1b",
                fontFamily: "var(--font-hanken, sans-serif)",
                width: "220px",
              }}
            />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Page title section */}
        <div>
          <p className="text-base" style={{ color: "#404944", maxWidth: "500px" }}>
            A complete record of administrative operations for system transparency and compliance.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "verified_user",
              label: "Total Entries",
              value: logs?.length ?? 0,
              iconBg: "#b0f0d6",
              iconColor: "#003527",
            },
            {
              icon: "today",
              label: "Today",
              value: (logs ?? []).filter((l) => new Date(l.createdAt).toDateString() === new Date().toDateString()).length,
              iconBg: "#bbf37c",
              iconColor: "#1c3400",
            },
            {
              icon: "shield",
              label: "Integrity",
              value: "Perfect",
              iconBg: "#ffdbd0",
              iconColor: "#ac3400",
            },
          ].map(({ icon, label, value, iconBg, iconColor }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-5 rounded-xl border"
              style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}
            >
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: iconBg }}>
                <span className="material-symbols-outlined text-[22px]" style={{ color: iconColor, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{label}</p>
                <p className="text-2xl font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Table */}
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
          {logs === undefined ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[40px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
              <p className="text-sm" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Loading audit log…</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[48px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>history</span>
              <p className="font-semibold" style={{ color: "#003527" }}>
                {search ? "No results found" : "No admin actions recorded yet"}
              </p>
              <p className="text-sm" style={{ color: "#707974" }}>
                {search ? `No logs match "${search}"` : "Actions will appear here once admins perform operations."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: "rgba(6,78,59,0.04)", borderBottom: "1px solid rgba(191,201,195,0.2)" }}>
                      {["Timestamp", "Admin", "Action", "Affected Staff", "Details"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4"
                          style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.06em", color: "#707974", textTransform: "uppercase" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, i) => {
                      const d = new Date(log.createdAt);
                      const dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                      const timeStr = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                      const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                      return (
                        <tr
                          key={log._id as string}
                          className="border-b transition-colors cursor-pointer"
                          style={{ borderColor: "rgba(191,201,195,0.15)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(6,78,59,0.03)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                        >
                          <td className="px-6 py-5">
                            <p className="font-bold text-xs" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#181d1b" }}>{dateStr}</p>
                            <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{timeStr}</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                style={{ backgroundColor: avatarColor }}
                              >
                                {initials(log.adminName)}
                              </div>
                              <span className="text-sm" style={{ color: "#181d1b" }}>{log.adminName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <ActionBadge action={log.action} />
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-sm" style={{ color: "#404944" }}>
                              {log.targetName ?? <em style={{ color: "#bfc9c3" }}>—</em>}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-xs" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                              {log.details ?? "—"}
                            </span>
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
                <span className="text-xs" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                  Showing {filteredLogs.length} of {logs.length} entries
                </span>
                {logs.length >= limit && (
                  <button
                    onClick={() => setLimit((l) => l + 100)}
                    className="flex items-center gap-1.5 text-xs font-bold transition-all"
                    style={{ color: "#003527" }}
                  >
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    Load more
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
