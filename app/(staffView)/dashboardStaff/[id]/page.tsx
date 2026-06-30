"use client";

import { use, useEffect, useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { XTable } from "@/components/XTable";
import { XModal } from "@/components/XModal";
import { toast } from "@/lib/toast";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const attendanceColumns = [
  { key: "entryDate", label: "Date", id: "entryDate" },
  { key: "entryTime", label: "Sign in Time", id: "entryTime" },
  { key: "status", label: "Status", id: "status" },
];

const paginationData = { page: 1, count: 1, total: 0 };

const chartOptions = {
  responsive: true,
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: "Number of Days", font: { size: 14 } } },
    x: { title: { display: true, text: "Months", font: { size: 14 } } },
  },
  plugins: {
    legend: { display: true, position: "top" as const },
    title: { display: true, text: "Staff Attendance Trends", font: { size: 16, weight: "bold" as const }, padding: 20 },
    tooltip: {
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: (ctx: any) =>
          `${ctx.dataset.label ?? ""}: ${ctx.parsed.y} day${ctx.parsed.y !== 1 ? "s" : ""}`,
      },
    },
  },
  elements: { line: { tension: 0.4 }, point: { radius: 5, hoverRadius: 7 } },
  interaction: { intersect: false, mode: "index" as const },
};

interface LogEntry {
  entryDate: string;
  entryTime: string;
  late?: boolean;
  status?: string;
  _originalEntryDate?: Date;
  _originalEntryTime?: Date;
  [key: string]: unknown;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Profile card ─────────────────────────────────────────────

function ProfileCard({
  staffData,
  isAdmin,
  isOwnDashboard,
  staffUserId,
}: {
  staffData: NonNullable<ReturnType<typeof useQuery<typeof api.staff.getStaffDetail>>>;
  isAdmin: boolean;
  isOwnDashboard: boolean;
  staffUserId: Id<"users">;
}) {
  const updateProfile = useMutation(api.staff.updateStaffProfile);
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const { staff, profile } = staffData;

  const [form, setForm] = useState({
    firstName: staff.firstName ?? "",
    lastName: staff.lastName ?? "",
    jobTitle: profile?.jobTitle ?? "",
    startDate: profile?.startDate ?? "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (showEdit) {
      setForm({
        firstName: staff.firstName ?? "",
        lastName: staff.lastName ?? "",
        jobTitle: profile?.jobTitle ?? "",
        startDate: profile?.startDate ?? "",
      });
    }
  }, [showEdit, staff, profile]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({
        staffUserId,
        firstName: form.firstName,
        lastName: form.lastName,
        jobTitle: form.jobTitle || undefined,
        startDate: form.startDate || undefined,
      });
      toast("Profile updated", "success");
      setShowEdit(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  const canEdit = isAdmin || isOwnDashboard;
  const fullName = `${staff.firstName ?? ""} ${staff.lastName ?? ""}`.trim() || staff.email;
  const rawInitials = ((staff.firstName?.[0] ?? "") + (staff.lastName?.[0] ?? "")).toUpperCase();
  const initials = rawInitials || (staff.email[0]?.toUpperCase() ?? "?");

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-2xl font-bold shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-500">{staff.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile?.jobTitle && (
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                  {profile.jobTitle}
                </span>
              )}
              {profile?.employmentStatus && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  profile.employmentStatus === "active"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {profile.employmentStatus}
                </span>
              )}
              {profile?.startDate && (
                <span className="text-xs text-gray-400">
                  Since {new Date(profile.startDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          {canEdit && (
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-1.5 text-sm text-purple-700 border border-purple-200 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors self-start sm:self-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <XModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Profile"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>Save Changes</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" name="firstName">
              <Input
                size="lg"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="First name"
              />
            </FormField>
            <FormField label="Last Name" name="lastName">
              <Input
                size="lg"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Last name"
              />
            </FormField>
          </div>
          {isAdmin && (
            <>
              <FormField label="Job Title / Role" name="jobTitle">
                <Input
                  size="lg"
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  placeholder="e.g. Software Engineer"
                />
              </FormField>
              <FormField label="Start Date" name="startDate">
                <Input
                  type="date"
                  size="lg"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </FormField>
            </>
          )}
        </div>
      </XModal>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const isAdmin = me?.role === "admin" || me?.platformRole === "superAdmin";
  const isOwnDashboard = me?._id === id;

  const staffData = useQuery(api.staff.getStaffDetail, { staffUserId: id as Id<"users"> });
  const todayEntry = useQuery(
    api.attendance.getTodayEntry,
    isOwnDashboard ? { staffUserId: id as Id<"users">, today: todayString() } : "skip"
  );
  const clockIn = useMutation(api.attendance.clockIn);

  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [filtered, setFiltered] = useState<LogEntry[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: { label: string; backgroundColor: string; borderColor: string; data: number[]; fill: boolean }[] }>({ labels: [], datasets: [] });
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const today = new Date();
    const ago30 = new Date();
    ago30.setDate(today.getDate() - 30);
    setEndDate(today.toISOString().split("T")[0]!);
    setStartDate(ago30.toISOString().split("T")[0]!);
  }, []);

  useEffect(() => {
    if (!staffData) return;
    const formatted: LogEntry[] = staffData.entryLogs.map((val) => {
      const entryDate = new Date(val.entryDate);
      const entryTime = new Date(val.entryTime);
      return {
        ...val,
        _originalEntryDate: entryDate,
        _originalEntryTime: entryTime,
        entryDate: entryDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        entryTime: entryTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
        status: val.late ? "Late" : "On Time",
      };
    });
    setAllLogs(formatted);
  }, [staffData]);

  useEffect(() => {
    if (!startDate || !endDate) { setFiltered(allLogs); return; }
    const s = new Date(startDate); s.setHours(0, 0, 0, 0);
    const e = new Date(endDate); e.setHours(23, 59, 59, 999);
    const f = allLogs.filter((l) => {
      const d = l._originalEntryDate!;
      return d >= s && d <= e;
    });
    setFiltered(f);
  }, [startDate, endDate, allLogs]);

  useEffect(() => {
    const stats = filtered.reduce<Record<string, { early: number; late: number }>>((acc, log) => {
      const d = log._originalEntryDate!;
      const key = d.toLocaleString("en-US", { month: "long", year: "numeric" });
      if (!acc[key]) acc[key] = { early: 0, late: 0 };
      if (log.late) acc[key]!.late += 1;
      else acc[key]!.early += 1;
      return acc;
    }, {});
    setChartData({
      labels: Object.keys(stats),
      datasets: [
        { label: "Early Arrivals", backgroundColor: "#4CAF50", borderColor: "#4CAF50", data: Object.values(stats).map((s) => s.early), fill: false },
        { label: "Late Arrivals", backgroundColor: "#FF5252", borderColor: "#FF5252", data: Object.values(stats).map((s) => s.late), fill: false },
      ],
    });
  }, [filtered]);

  const staffName = staffData
    ? `${staffData.staff.firstName ?? ""} ${staffData.staff.lastName ?? ""}`.trim() || staffData.staff.email
    : "";

  const handleClockIn = async () => {
    setSigningIn(true);
    try {
      await clockIn({ today: todayString() });
      toast("Signed in successfully!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to sign in", "error");
    } finally {
      setSigningIn(false);
    }
  };

  const exportToCSV = () => {
    if (filtered.length === 0) { alert("No data to export."); return; }
    const headers = ["Date", "Sign in Time", "Status"];
    const rows = [...filtered]
      .sort((a, b) => b._originalEntryDate!.getTime() - a._originalEntryDate!.getTime())
      .map((row) => {
        const d = row._originalEntryDate!.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        const t = row._originalEntryTime!.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
        return [d, t, row.late ? "Late" : "On Time"].map((f) => (String(f).includes(",") ? `"${f}"` : f)).join(",");
      });
    const csv = [headers.join(","), ...rows].join("\n");
    const filename = `${staffName.replace(/\s+/g, "_")}_attendance_${startDate || "all"}_to_${endDate || "all"}.csv`;
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
  };

  if (staffData === undefined) {
    return (
      <div className="w-full p-4 flex items-center justify-center min-h-[200px]">
        <p className="text-gray-400 text-sm">Loading profile…</p>
      </div>
    );
  }

  if (staffData === null) {
    return (
      <div className="w-full p-4 flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500 text-sm">Staff profile not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">

        {/* Profile card */}
        <ProfileCard
          staffData={staffData}
          isAdmin={isAdmin}
          isOwnDashboard={isOwnDashboard}
          staffUserId={id as Id<"users">}
        />

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">{staffName} — Attendance Summary</h2>
          <div className="flex flex-wrap gap-3">
            {isOwnDashboard && (
              todayEntry === undefined ? null : todayEntry ? (
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                  Signed in today at{" "}
                  {new Date(todayEntry.entryTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                  {todayEntry.late ? " (Late)" : " (On Time)"}
                </span>
              ) : (
                <Button loading={signingIn} onClick={handleClockIn} color="primary" size="md">
                  Sign In Now
                </Button>
              )
            )}
            <Button onClick={exportToCSV} color="primary" size="md" className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </Button>
          </div>
        </div>

        {/* Date filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <FormField label="Start Date" name="startDate">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} size="md" />
              </FormField>
            </div>
            <div className="flex-1">
              <FormField label="End Date" name="endDate">
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} size="md" />
              </FormField>
            </div>
            <Button onClick={() => { setStartDate(""); setEndDate(""); }} color="gray" variant="outline" size="md">
              Clear
            </Button>
          </div>
          {filtered.length > 0 && (
            <p className="text-sm text-gray-600 mt-3">
              Showing {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              {startDate && endDate && ` · ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`}
            </p>
          )}
        </div>

        {/* Chart (admins only) */}
        {isAdmin && chartData.labels.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 mb-8">
            <div className="h-[300px] md:h-[400px] lg:h-[500px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Attendance table */}
        <XTable
          columns={attendanceColumns}
          tableData={filtered as Record<string, unknown>[]}
          paginationData={paginationData}
        />
      </div>
    </div>
  );
}
