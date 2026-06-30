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
import { XModal } from "@/components/XModal";
import { toast } from "@/lib/toast";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ITEMS_PER_PAGE = 30;

const chartOptions = {
  responsive: true,
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: "JetBrains Mono, monospace", size: 11 }, color: "#707974" }, grid: { color: "#ebefec" } },
    x: { ticks: { font: { family: "JetBrains Mono, monospace", size: 11 }, color: "#707974" }, grid: { display: false } },
  },
  plugins: {
    legend: { display: true, position: "top" as const, labels: { font: { family: "Hanken Grotesk, sans-serif", size: 12 }, color: "#404944" } },
    title: { display: false },
    tooltip: {
      backgroundColor: "#003527",
      padding: 12,
      titleFont: { family: "Hanken Grotesk, sans-serif", size: 13 },
      bodyFont: { family: "JetBrains Mono, monospace", size: 12 },
      cornerRadius: 8,
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: (ctx: any) => `${ctx.dataset.label ?? ""}: ${ctx.parsed.y} day${ctx.parsed.y !== 1 ? "s" : ""}`,
      },
    },
  },
  elements: { line: { tension: 0.4 }, point: { radius: 4, hoverRadius: 6 } },
  interaction: { intersect: false, mode: "index" as const },
};

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

interface LogEntry {
  _id: Id<"attendanceLogs">;
  entryDate: string;
  entryTime: string;
  clockOutStr: string;
  hoursWorked: string;
  late?: boolean;
  status?: string;
  _originalEntryDate?: Date;
  _originalEntryTime?: Date;
  [key: string]: unknown;
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
  const setRole = useMutation(api.organizations.setOrgMemberRole);
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [promotingRole, setPromotingRole] = useState(false);

  const { staff, profile } = staffData;

  const [form, setForm] = useState({
    firstName: staff.firstName ?? "",
    lastName: staff.lastName ?? "",
    jobTitle: profile?.jobTitle ?? "",
    startDate: profile?.startDate ?? "",
  });

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
      await updateProfile({ staffUserId, firstName: form.firstName, lastName: form.lastName, jobTitle: form.jobTitle || undefined, startDate: form.startDate || undefined });
      toast("Profile updated", "success");
      setShowEdit(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to update profile", "error");
    } finally { setSaving(false); }
  }

  async function handleToggleRole() {
    if (!profile?.organizationId) return;
    const newRole = profile.orgRole === "admin" ? "staff" : "admin";
    setPromotingRole(true);
    try {
      await setRole({ organizationId: profile.organizationId, userId: staffUserId, orgRole: newRole });
      toast(`Role updated to ${newRole}`, "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to update role", "error");
    } finally { setPromotingRole(false); }
  }

  const canEdit = isAdmin || isOwnDashboard;
  const fullName = `${staff.firstName ?? ""} ${staff.lastName ?? ""}`.trim() || staff.email;
  const rawInitials = ((staff.firstName?.[0] ?? "") + (staff.lastName?.[0] ?? "")).toUpperCase();
  const initials = rawInitials || (staff.email[0]?.toUpperCase() ?? "?");
  const isStaff = profile?.orgRole !== "admin";

  return (
    <>
      <div
        className="rounded-xl border p-6 mb-6"
        style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)", boxShadow: "0 2px 10px rgba(6,78,59,0.04)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
            style={{ backgroundColor: "#064e3b", color: "#b0f0d6", fontFamily: "var(--font-hanken, sans-serif)" }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>{fullName}</h2>
            <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{staff.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile?.jobTitle && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono" style={{ backgroundColor: "#b0f0d6", color: "#0b513d" }}>
                  {profile.jobTitle}
                </span>
              )}
              {profile?.orgRole && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono" style={
                  profile.orgRole === "admin"
                    ? { backgroundColor: "#064e3b", color: "#80bea6" }
                    : { backgroundColor: "#ebefec", color: "#404944" }
                }>
                  {profile.orgRole === "admin" ? "Admin" : "Staff"}
                </span>
              )}
              {profile?.employmentStatus && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono" style={
                  profile.employmentStatus === "active"
                    ? { backgroundColor: "#bbf37c", color: "#1c3400" }
                    : { backgroundColor: "#ebefec", color: "#707974" }
                }>
                  {profile.employmentStatus}
                </span>
              )}
              {profile?.startDate && (
                <span className="text-xs" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                  Since {new Date(profile.startDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap self-start sm:self-center">
            {canEdit && (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-all border"
                style={{ color: "#003527", borderColor: "rgba(191,201,195,0.5)", backgroundColor: "transparent" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Edit Profile
              </button>
            )}
            {isAdmin && !isOwnDashboard && profile?.organizationId && (
              <button
                onClick={handleToggleRole}
                disabled={promotingRole}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-all border disabled:opacity-50"
                style={
                  isStaff
                    ? { color: "#064e3b", borderColor: "rgba(6,78,59,0.3)", backgroundColor: "transparent" }
                    : { color: "#707974", borderColor: "rgba(191,201,195,0.5)", backgroundColor: "transparent" }
                }
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                {promotingRole ? "…" : isStaff ? "Promote to Admin" : "Demote to Staff"}
              </button>
            )}
          </div>
        </div>
      </div>

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
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" name="firstName">
              <Input size="lg" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
            </FormField>
            <FormField label="Last Name" name="lastName">
              <Input size="lg" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
            </FormField>
          </div>
          {isAdmin && (
            <>
              <FormField label="Job Title / Role" name="jobTitle">
                <Input size="lg" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="e.g. Software Engineer" />
              </FormField>
              <FormField label="Start Date" name="startDate">
                <Input type="date" size="lg" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </FormField>
            </>
          )}
        </div>
      </XModal>
    </>
  );
}

// ─── Leave section ────────────────────────────────────────────

function LeaveSection({ staffUserId, isAdmin, isOwnDashboard }: { staffUserId: Id<"users">; isAdmin: boolean; isOwnDashboard: boolean; }) {
  const leaveRequests = useQuery(api.leave.listStaffLeaveRequests, { staffUserId });
  const requestLeave = useMutation(api.leave.requestLeave);
  const cancelLeave = useMutation(api.leave.cancelLeave);
  const reviewLeave = useMutation(api.leave.reviewLeave);

  const [showRequest, setShowRequest] = useState(false);
  const [showReview, setShowReview] = useState<Id<"leaveRequests"> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "annual" as "annual" | "sick" | "other", startDate: "", endDate: "", reason: "" });
  const [reviewNote, setReviewNote] = useState("");

  async function handleRequestLeave() {
    if (!leaveForm.startDate || !leaveForm.endDate) { toast("Select start and end dates", "error"); return; }
    setSubmitting(true);
    try {
      await requestLeave({ type: leaveForm.type, startDate: leaveForm.startDate, endDate: leaveForm.endDate, reason: leaveForm.reason || undefined });
      toast("Leave request submitted", "success");
      setShowRequest(false);
      setLeaveForm({ type: "annual", startDate: "", endDate: "", reason: "" });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to submit request", "error");
    } finally { setSubmitting(false); }
  }

  async function handleCancel(reqId: Id<"leaveRequests">) {
    try {
      await cancelLeave({ requestId: reqId });
      toast("Request cancelled", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to cancel", "error");
    }
  }

  async function handleReview(decision: "approved" | "rejected") {
    if (!showReview) return;
    setSubmitting(true);
    try {
      await reviewLeave({ requestId: showReview, decision, reviewNote: reviewNote || undefined });
      toast(`Request ${decision}`, "success");
      setShowReview(null); setReviewNote("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to review", "error");
    } finally { setSubmitting(false); }
  }

  const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
    approved: { bg: "#b0f0d6", color: "#0b513d" },
    rejected: { bg: "#ffdad6", color: "#93000a" },
    pending: { bg: "#ffdbd0", color: "#832600" },
  };

  const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
    annual: { bg: "#b0f0d6", color: "#0b513d" },
    sick: { bg: "#ffdbd0", color: "#832600" },
    other: { bg: "#ebefec", color: "#404944" },
  };

  return (
    <div className="rounded-xl border overflow-hidden mt-8" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "#f6faf7" }}>
        <h3 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Leave Requests</h3>
        {isOwnDashboard && (
          <button
            onClick={() => setShowRequest(true)}
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg"
            style={{ backgroundColor: "#003527", color: "#ffffff" }}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Request Leave
          </button>
        )}
      </div>

      {leaveRequests === undefined ? (
        <div className="py-10 flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-[28px]" style={{ color: "#003527" }}>progress_activity</span>
        </div>
      ) : leaveRequests.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-[36px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>event_busy</span>
          <p className="text-sm" style={{ color: "#707974" }}>No leave requests yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ backgroundColor: "rgba(241,245,242,0.6)", borderBottom: "1px solid rgba(191,201,195,0.2)" }}>
                {["Type", "From", "To", "Days", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3" style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.06em", color: "#707974", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req) => {
                const ss = STATUS_STYLE[req.status] ?? STATUS_STYLE.pending;
                const ts = TYPE_STYLE[req.type] ?? TYPE_STYLE.other;
                return (
                  <tr key={req._id} className="border-b transition-colors" style={{ borderColor: "rgba(191,201,195,0.15)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(241,245,242,0.5)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono capitalize" style={{ backgroundColor: ts.bg, color: ts.color }}>{req.type}</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-mono" style={{ color: "#404944" }}>{req.startDate}</td>
                    <td className="px-5 py-4 text-sm font-mono" style={{ color: "#404944" }}>{req.endDate}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "#404944" }}>{req.daysRequested}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono capitalize" style={{ backgroundColor: ss.bg, color: ss.color }}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {isOwnDashboard && req.status === "pending" && (
                          <button onClick={() => handleCancel(req._id)} className="text-xs font-bold transition-all" style={{ color: "#ba1a1a" }}>Cancel</button>
                        )}
                        {isAdmin && req.status === "pending" && (
                          <button onClick={() => { setShowReview(req._id); setReviewNote(""); }} className="text-xs font-bold transition-all" style={{ color: "#003527" }}>Review</button>
                        )}
                        {req.reviewNote && (
                          <span className="text-xs italic" style={{ color: "#bfc9c3" }} title={req.reviewNote}>Note</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Request Leave Modal */}
      <XModal open={showRequest} onClose={() => setShowRequest(false)} title="Request Leave" size="md"
        footer={<div className="flex justify-end gap-3"><Button color="gray" variant="soft" onClick={() => setShowRequest(false)}>Cancel</Button><Button loading={submitting} onClick={handleRequestLeave}>Submit Request</Button></div>}
      >
        <div className="space-y-4 p-1">
          <FormField label="Leave Type" name="type">
            <select
              value={leaveForm.type}
              onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value as "annual" | "sick" | "other" })}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b" }}
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="other">Other</option>
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" name="startDate">
              <Input type="date" size="lg" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
            </FormField>
            <FormField label="End Date" name="endDate">
              <Input type="date" size="lg" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Reason (optional)" name="reason">
            <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b" }}
              placeholder="Brief reason for leave…" />
          </FormField>
        </div>
      </XModal>

      {/* Review Modal */}
      <XModal open={!!showReview} onClose={() => setShowReview(null)} title="Review Leave Request" size="sm"
        footer={<div className="flex justify-end gap-3"><Button color="gray" variant="soft" onClick={() => setShowReview(null)}>Cancel</Button><Button color="red" loading={submitting} onClick={() => handleReview("rejected")}>Reject</Button><Button loading={submitting} onClick={() => handleReview("approved")}>Approve</Button></div>}
      >
        <div className="space-y-4 p-1">
          <p className="text-sm" style={{ color: "#707974" }}>Add an optional note for the staff member.</p>
          <FormField label="Review Note (optional)" name="reviewNote">
            <textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b" }}
              placeholder="e.g. Approved, enjoy your time off!" />
          </FormField>
        </div>
      </XModal>
    </div>
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
  const todayEntry = useQuery(api.attendance.getTodayEntry, isOwnDashboard ? { staffUserId: id as Id<"users"> } : "skip");
  const clockInMutation = useMutation(api.attendance.clockIn);
  const clockOutMutation = useMutation(api.attendance.clockOut);
  const adminAddAttendance = useMutation(api.attendance.adminAddAttendance);
  const adminDeleteAttendance = useMutation(api.attendance.adminDeleteAttendance);

  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [filtered, setFiltered] = useState<LogEntry[]>([]);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { label: string; backgroundColor: string; borderColor: string; data: number[]; fill: boolean }[];
  }>({ labels: [], datasets: [] });

  const [signingIn, setSigningIn] = useState(false);
  const [clockingOut, setClockingOut] = useState(false);
  const [deletingLog, setDeletingLog] = useState<string | null>(null);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [addEntryForm, setAddEntryForm] = useState({ entryDate: "", entryTimeStr: "09:00" });
  const [addingEntry, setAddingEntry] = useState(false);

  useEffect(() => {
    const today = new Date();
    const ago30 = new Date();
    ago30.setDate(today.getDate() - 30);
    setEndDate(today.toISOString().split("T")[0]!);
    setStartDate(ago30.toISOString().split("T")[0]!);
  }, []);

  useEffect(() => {
    if (!staffData?.entryLogs) return;
    const logs: LogEntry[] = staffData.entryLogs.map((log) => {
      const entryDateObj = new Date(log.entryTime);
      const clockOutObj = log.clockOutTime ? new Date(log.clockOutTime) : null;
      return {
        _id: log._id,
        entryDate: entryDateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        entryTime: entryDateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
        clockOutStr: clockOutObj ? clockOutObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }) : "—",
        hoursWorked: log.hoursWorked !== undefined ? `${log.hoursWorked}h` : "—",
        late: log.late,
        status: log.late ? "Late" : "On Time",
        latitude: log.latitude,
        longitude: log.longitude,
        _originalEntryDate: entryDateObj,
        _originalEntryTime: entryDateObj,
        _rawDate: log.entryDate,
        _logId: log._id,
      };
    });
    logs.sort((a, b) => (b._originalEntryDate?.getTime() ?? 0) - (a._originalEntryDate?.getTime() ?? 0));
    setAllLogs(logs);
  }, [staffData]);

  useEffect(() => {
    let result = allLogs;
    if (startDate) result = result.filter((r) => (r._rawDate as string) >= startDate);
    if (endDate) result = result.filter((r) => (r._rawDate as string) <= endDate);
    setFiltered(result);
    setDisplayCount(ITEMS_PER_PAGE);
  }, [allLogs, startDate, endDate]);

  useEffect(() => {
    if (filtered.length === 0) { setChartData({ labels: [], datasets: [] }); return; }
    const stats: Record<string, { onTime: number; late: number }> = {};
    for (const log of filtered) {
      const month = (log._rawDate as string)?.slice(0, 7) ?? "";
      if (!stats[month]) stats[month] = { onTime: 0, late: 0 };
      if (log.late) stats[month].late++;
      else stats[month].onTime++;
    }
    const sortedMonths = Object.keys(stats).sort();
    setChartData({
      labels: sortedMonths.map((m) => {
        const [yr, mo] = m.split("-");
        return new Date(Number(yr), Number(mo) - 1).toLocaleString("en-US", { month: "short", year: "2-digit" });
      }),
      datasets: [
        { label: "On Time", backgroundColor: "#003527", borderColor: "#003527", data: sortedMonths.map((m) => stats[m]!.onTime), fill: false },
        { label: "Late Arrivals", backgroundColor: "#ac3400", borderColor: "#ac3400", data: sortedMonths.map((m) => stats[m]!.late), fill: false },
      ],
    });
  }, [filtered]);

  const staffName = staffData
    ? `${staffData.staff.firstName ?? ""} ${staffData.staff.lastName ?? ""}`.trim() || staffData.staff.email
    : "";

  const handleClockIn = async () => {
    setSigningIn(true);
    try {
      let latitude: number | undefined;
      let longitude: number | undefined;
      if (typeof navigator !== "undefined" && "geolocation" in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000, maximumAge: 60000 });
          });
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
        } catch { /* Location denied — proceed anyway */ }
      }
      await clockInMutation({ latitude, longitude });
      toast("Signed in successfully!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to sign in", "error");
    } finally { setSigningIn(false); }
  };

  const handleClockOut = async () => {
    setClockingOut(true);
    try {
      await clockOutMutation();
      toast("Clocked out successfully!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to clock out", "error");
    } finally { setClockingOut(false); }
  };

  const handleAddEntry = async () => {
    if (!addEntryForm.entryDate) { toast("Select a date", "error"); return; }
    setAddingEntry(true);
    try {
      await adminAddAttendance({ staffUserId: id as Id<"users">, entryDate: addEntryForm.entryDate, entryTimeStr: addEntryForm.entryTimeStr });
      toast("Attendance entry added", "success");
      setShowAddEntry(false);
      setAddEntryForm({ entryDate: "", entryTimeStr: "09:00" });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to add entry", "error");
    } finally { setAddingEntry(false); }
  };

  const handleDeleteLog = async (logId: string) => {
    if (!confirm("Delete this attendance entry?")) return;
    setDeletingLog(logId);
    try {
      await adminDeleteAttendance({ logId: logId as Id<"attendanceLogs"> });
      toast("Entry deleted", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to delete", "error");
    } finally { setDeletingLog(null); }
  };

  const exportToCSV = () => {
    if (filtered.length === 0) { alert("No data to export."); return; }
    const headers = ["Date", "Sign in Time", "Clock Out", "Hours", "Status"];
    const rows = filtered.map((row) =>
      [row.entryDate, row.entryTime, row.clockOutStr, row.hoursWorked, row.late ? "Late" : "On Time"]
        .map((f) => (String(f).includes(",") ? `"${f}"` : f)).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${staffName.replace(/\s+/g, "_")}_attendance_${startDate || "all"}_to_${endDate || "all"}.csv`);
  };

  if (staffData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6faf7" }}>
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
          <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "12px", color: "#707974" }}>Loading profile…</p>
        </div>
      </div>
    );
  }

  if (staffData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6faf7" }}>
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-[48px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>person_off</span>
          <p style={{ color: "#707974" }}>Staff profile not found.</p>
        </div>
      </div>
    );
  }

  const displayedLogs = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f6faf7" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: "#f6faf7", borderColor: "rgba(191,201,195,0.4)", boxShadow: "0 1px 12px rgba(6,78,59,0.04)" }}>
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div>
            <h1 className="font-bold text-xl leading-none" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
              {staffName}
            </h1>
            <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Attendance & Profile</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Clock in / out for own dashboard */}
            {isOwnDashboard && todayEntry !== undefined && (
              todayEntry ? (
                <>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                    style={todayEntry.late ? { backgroundColor: "#ffdbd0", color: "#832600" } : { backgroundColor: "#b0f0d6", color: "#0b513d" }}
                  >
                    <span className="material-symbols-outlined text-[16px]">{todayEntry.late ? "alarm_on" : "check_circle"}</span>
                    <span className="font-mono text-xs">
                      In {new Date(todayEntry.entryTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                      {todayEntry.late ? " · Late" : " · On Time"}
                    </span>
                  </div>
                  {!todayEntry.clockOutTime && (
                    <button
                      onClick={handleClockOut}
                      disabled={clockingOut}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-60 transition-all"
                      style={{ backgroundColor: "#ebefec", color: "#003527", border: "1px solid rgba(191,201,195,0.5)" }}
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      {clockingOut ? "…" : "Clock Out"}
                    </button>
                  )}
                  {todayEntry.clockOutTime && (
                    <span className="text-xs px-3 py-1.5 rounded-lg font-mono" style={{ backgroundColor: "#ebefec", color: "#707974" }}>
                      Out {new Date(todayEntry.clockOutTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                      {todayEntry.hoursWorked !== undefined ? ` · ${todayEntry.hoursWorked}h` : ""}
                    </span>
                  )}
                </>
              ) : (
                <button
                  onClick={handleClockIn}
                  disabled={signingIn}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-60"
                  style={{ backgroundColor: "#003527", color: "#ffffff" }}
                >
                  <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                  {signingIn ? "Signing in…" : "Sign In Now"}
                </button>
              )
            )}

            {/* Admin add entry */}
            {isAdmin && !isOwnDashboard && (
              <button
                onClick={() => setShowAddEntry(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold border transition-all"
                style={{ color: "#003527", borderColor: "rgba(191,201,195,0.5)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Entry
              </button>
            )}

            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ backgroundColor: "#ac3400", color: "#ffffff" }}
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        {/* Profile card */}
        <ProfileCard staffData={staffData} isAdmin={isAdmin} isOwnDashboard={isOwnDashboard} staffUserId={id as Id<"users">} />

        {/* Date filter */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Start Date</p>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b", fontFamily: "var(--font-jetbrains, monospace)" }}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>End Date</p>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b", fontFamily: "var(--font-jetbrains, monospace)" }}
              />
            </div>
            <button
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="px-4 py-2 rounded-lg text-sm border transition-all"
              style={{ color: "#707974", borderColor: "rgba(191,201,195,0.5)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              Clear
            </button>
          </div>
          {filtered.length > 0 && (
            <p className="text-xs mt-3" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
              Showing {Math.min(displayCount, filtered.length)} of {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Attendance trend chart (admins only) */}
        {isAdmin && chartData.labels.length > 0 && (
          <div className="rounded-xl border p-6" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
            <h3 className="font-bold mb-5" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Attendance Trend</h3>
            <div style={{ height: "280px" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Attendance table */}
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "#f6faf7" }}>
            <h3 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Attendance History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ backgroundColor: "rgba(241,245,242,0.6)", borderBottom: "1px solid rgba(191,201,195,0.2)" }}>
                  {["Date", "Sign In", "Clock Out", "Hours", "Status", ...(isAdmin ? [""] : [])].map((h) => (
                    <th key={h} className="px-5 py-3" style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.06em", color: "#707974", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-12" style={{ color: "#707974", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "13px" }}>
                      No attendance records found for this period.
                    </td>
                  </tr>
                ) : (
                  displayedLogs.map((row) => (
                    <tr key={row._id as string} className="border-b transition-colors" style={{ borderColor: "rgba(191,201,195,0.15)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(241,245,242,0.5)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                    >
                      <td className="px-5 py-4 text-sm" style={{ color: "#181d1b" }}>{row.entryDate}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-sm font-mono" style={{ color: "#404944" }}>
                          {row.entryTime}
                          {(row.latitude as number | null) != null && (row.longitude as number | null) != null && (
                            <a
                              href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`${(row.latitude as number).toFixed(4)}, ${(row.longitude as number).toFixed(4)}`}
                            >
                              <span className="material-symbols-outlined text-[14px]" style={{ color: "#003527" }}>location_on</span>
                            </a>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-mono" style={{ color: "#707974" }}>{row.clockOutStr}</td>
                      <td className="px-5 py-4 text-sm font-mono" style={{ color: "#707974" }}>{row.hoursWorked}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono" style={
                          row.late ? { backgroundColor: "#ffdbd0", color: "#832600" } : { backgroundColor: "#b0f0d6", color: "#0b513d" }
                        }>
                          {row.late ? "Late" : "On Time"}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDeleteLog(row._logId as string)}
                            disabled={deletingLog === (row._logId as string)}
                            className="p-1 rounded transition-all disabled:opacity-50"
                            style={{ color: "#707974" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ba1a1a"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#707974"; }}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {deletingLog === (row._logId as string) ? "progress_activity" : "delete"}
                            </span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "rgba(241,245,242,0.4)" }}>
              <span className="text-xs" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                {filtered.length - displayCount} more records
              </span>
              <button
                onClick={() => setDisplayCount((c) => c + ITEMS_PER_PAGE)}
                className="flex items-center gap-1.5 text-xs font-bold"
                style={{ color: "#003527" }}
              >
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                Show more
              </button>
            </div>
          )}
        </div>

        {/* Leave section */}
        <LeaveSection staffUserId={id as Id<"users">} isAdmin={isAdmin} isOwnDashboard={isOwnDashboard} />
      </div>

      {/* Admin: Add Entry Modal */}
      <XModal
        open={showAddEntry}
        onClose={() => setShowAddEntry(false)}
        title="Add Attendance Entry"
        size="sm"
        footer={<div className="flex justify-end gap-3"><Button color="gray" variant="soft" onClick={() => setShowAddEntry(false)}>Cancel</Button><Button loading={addingEntry} onClick={handleAddEntry}>Add Entry</Button></div>}
      >
        <div className="space-y-4 p-1">
          <p className="text-sm" style={{ color: "#707974" }}>Manually record a clock-in for {staffName}.</p>
          <FormField label="Date" name="entryDate">
            <Input type="date" size="lg" value={addEntryForm.entryDate} max={todayString()} onChange={(e) => setAddEntryForm({ ...addEntryForm, entryDate: e.target.value })} />
          </FormField>
          <FormField label="Sign In Time (HH:mm)" name="entryTimeStr">
            <Input type="time" size="lg" value={addEntryForm.entryTimeStr} onChange={(e) => setAddEntryForm({ ...addEntryForm, entryTimeStr: e.target.value })} />
          </FormField>
        </div>
      </XModal>
    </div>
  );
}
