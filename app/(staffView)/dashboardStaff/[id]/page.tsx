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

// ─── Status badge ─────────────────────────────────────────────

function StatusBadge({ late }: { late: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      late ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
    }`}>
      {late ? "Late" : "On Time"}
    </span>
  );
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

  async function handleToggleRole() {
    if (!profile?.organizationId) return;
    const newRole = profile.orgRole === "admin" ? "staff" : "admin";
    setPromotingRole(true);
    try {
      await setRole({
        organizationId: profile.organizationId,
        userId: staffUserId,
        orgRole: newRole,
      });
      toast(`Role updated to ${newRole}`, "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to update role", "error");
    } finally {
      setPromotingRole(false);
    }
  }

  const canEdit = isAdmin || isOwnDashboard;
  const fullName = `${staff.firstName ?? ""} ${staff.lastName ?? ""}`.trim() || staff.email;
  const rawInitials = ((staff.firstName?.[0] ?? "") + (staff.lastName?.[0] ?? "")).toUpperCase();
  const initials = rawInitials || (staff.email[0]?.toUpperCase() ?? "?");
  const isStaff = profile?.orgRole !== "admin";

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-2xl font-bold shrink-0">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-500">{staff.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile?.jobTitle && (
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                  {profile.jobTitle}
                </span>
              )}
              {profile?.orgRole && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  profile.orgRole === "admin" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {profile.orgRole === "admin" ? "Admin" : "Staff"}
                </span>
              )}
              {profile?.employmentStatus && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  profile.employmentStatus === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
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

          <div className="flex gap-2 flex-wrap self-start sm:self-center">
            {canEdit && (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 text-sm text-purple-700 border border-purple-200 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            )}
            {isAdmin && !isOwnDashboard && profile?.organizationId && (
              <button
                onClick={handleToggleRole}
                disabled={promotingRole}
                className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-colors border ${
                  isStaff
                    ? "text-blue-700 border-blue-200 hover:bg-blue-50"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
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
        <div className="space-y-4">
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

function LeaveSection({
  staffUserId,
  isAdmin,
  isOwnDashboard,
}: {
  staffUserId: Id<"users">;
  isAdmin: boolean;
  isOwnDashboard: boolean;
}) {
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
    } finally {
      setSubmitting(false);
    }
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
      setShowReview(null);
      setReviewNote("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to review", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const statusColor = (status: string) => {
    if (status === "approved") return "bg-green-50 text-green-700";
    if (status === "rejected") return "bg-red-50 text-red-700";
    return "bg-yellow-50 text-yellow-700";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
        {isOwnDashboard && (
          <Button size="sm" onClick={() => setShowRequest(true)}>
            + Request Leave
          </Button>
        )}
      </div>

      {leaveRequests === undefined ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : leaveRequests.length === 0 ? (
        <p className="text-sm text-gray-400">No leave requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Type</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">From</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">To</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Days</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req) => (
                <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-3 capitalize">{req.type}</td>
                  <td className="py-3 px-3">{req.startDate}</td>
                  <td className="py-3 px-3">{req.endDate}</td>
                  <td className="py-3 px-3">{req.daysRequested}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(req.status)}`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      {isOwnDashboard && req.status === "pending" && (
                        <button onClick={() => handleCancel(req._id)} className="text-xs text-red-600 hover:underline">Cancel</button>
                      )}
                      {isAdmin && req.status === "pending" && (
                        <button onClick={() => { setShowReview(req._id); setReviewNote(""); }} className="text-xs text-blue-600 hover:underline">Review</button>
                      )}
                      {req.reviewNote && (
                        <span className="text-xs text-gray-400 italic" title={req.reviewNote}>Note</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Request Leave Modal */}
      <XModal
        open={showRequest}
        onClose={() => setShowRequest(false)}
        title="Request Leave"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowRequest(false)}>Cancel</Button>
            <Button loading={submitting} onClick={handleRequestLeave}>Submit Request</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Leave Type" name="type">
            <select
              value={leaveForm.type}
              onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value as "annual" | "sick" | "other" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <textarea
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Brief reason for leave…"
            />
          </FormField>
        </div>
      </XModal>

      {/* Review Modal */}
      <XModal
        open={!!showReview}
        onClose={() => setShowReview(null)}
        title="Review Leave Request"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowReview(null)}>Cancel</Button>
            <Button color="red" loading={submitting} onClick={() => handleReview("rejected")}>Reject</Button>
            <Button loading={submitting} onClick={() => handleReview("approved")}>Approve</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Add an optional note for the staff member.</p>
          <FormField label="Review Note (optional)" name="reviewNote">
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="e.g. Approved, enjoy your time off!"
            />
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
  const todayEntry = useQuery(
    api.attendance.getTodayEntry,
    isOwnDashboard ? { staffUserId: id as Id<"users"> } : "skip"
  );
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

  // Admin add entry modal
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
        clockOutStr: clockOutObj
          ? clockOutObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
          : "—",
        hoursWorked: log.hoursWorked !== undefined ? `${log.hoursWorked}h` : "—",
        late: log.late,
        status: log.late ? "Late" : "On Time",
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
        { label: "On Time", backgroundColor: "#7C3AED", borderColor: "#7C3AED", data: sortedMonths.map((m) => stats[m]!.onTime), fill: false },
        { label: "Late Arrivals", backgroundColor: "#FF5252", borderColor: "#FF5252", data: sortedMonths.map((m) => stats[m]!.late), fill: false },
      ],
    });
  }, [filtered]);

  const staffName = staffData
    ? `${staffData.staff.firstName ?? ""} ${staffData.staff.lastName ?? ""}`.trim() || staffData.staff.email
    : "";

  const handleClockIn = async () => {
    setSigningIn(true);
    try {
      await clockInMutation();
      toast("Signed in successfully!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to sign in", "error");
    } finally {
      setSigningIn(false);
    }
  };

  const handleClockOut = async () => {
    setClockingOut(true);
    try {
      await clockOutMutation();
      toast("Clocked out successfully!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to clock out", "error");
    } finally {
      setClockingOut(false);
    }
  };

  const handleAddEntry = async () => {
    if (!addEntryForm.entryDate) { toast("Select a date", "error"); return; }
    setAddingEntry(true);
    try {
      await adminAddAttendance({
        staffUserId: id as Id<"users">,
        entryDate: addEntryForm.entryDate,
        entryTimeStr: addEntryForm.entryTimeStr,
      });
      toast("Attendance entry added", "success");
      setShowAddEntry(false);
      setAddEntryForm({ entryDate: "", entryTimeStr: "09:00" });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to add entry", "error");
    } finally {
      setAddingEntry(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (!confirm("Delete this attendance entry?")) return;
    setDeletingLog(logId);
    try {
      await adminDeleteAttendance({ logId: logId as Id<"attendanceLogs"> });
      toast("Entry deleted", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to delete", "error");
    } finally {
      setDeletingLog(null);
    }
  };

  const exportToCSV = () => {
    if (filtered.length === 0) { alert("No data to export."); return; }
    const headers = ["Date", "Sign in Time", "Clock Out", "Hours", "Status"];
    const rows = filtered.map((row) => {
      return [row.entryDate, row.entryTime, row.clockOutStr, row.hoursWorked, row.late ? "Late" : "On Time"]
        .map((f) => (String(f).includes(",") ? `"${f}"` : f)).join(",");
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

  const displayedLogs = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

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
            {/* Clock in / clock out for own dashboard */}
            {isOwnDashboard && (
              todayEntry === undefined ? null : todayEntry ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                    Signed in at{" "}
                    {new Date(todayEntry.entryTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                    {todayEntry.late ? " (Late)" : " (On Time)"}
                  </span>
                  {!todayEntry.clockOutTime && (
                    <Button loading={clockingOut} onClick={handleClockOut} color="gray" size="md">
                      Clock Out
                    </Button>
                  )}
                  {todayEntry.clockOutTime && (
                    <span className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-50 text-gray-600 text-sm border border-gray-200">
                      Out at {new Date(todayEntry.clockOutTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                      {todayEntry.hoursWorked !== undefined && ` · ${todayEntry.hoursWorked}h`}
                    </span>
                  )}
                </div>
              ) : (
                <Button loading={signingIn} onClick={handleClockIn} color="primary" size="md">
                  Sign In Now
                </Button>
              )
            )}

            {/* Admin add entry */}
            {isAdmin && !isOwnDashboard && (
              <Button onClick={() => setShowAddEntry(true)} color="gray" size="md" variant="outline">
                + Add Entry
              </Button>
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
              Showing {Math.min(displayCount, filtered.length)} of {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              {startDate && endDate && ` · ${new Date(startDate + "T00:00:00").toLocaleDateString()} to ${new Date(endDate + "T00:00:00").toLocaleDateString()}`}
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Sign In</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Clock Out</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Hours</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  {isAdmin && <th className="py-3 px-4" />}
                </tr>
              </thead>
              <tbody>
                {displayedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-gray-400 text-sm">
                      No attendance records found for this period.
                    </td>
                  </tr>
                ) : (
                  displayedLogs.map((row) => (
                    <tr key={row._id as string} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-gray-900">{row.entryDate}</td>
                      <td className="py-3 px-4 text-gray-700">{row.entryTime}</td>
                      <td className="py-3 px-4 text-gray-500">{row.clockOutStr}</td>
                      <td className="py-3 px-4 text-gray-500">{row.hoursWorked}</td>
                      <td className="py-3 px-4">
                        <StatusBadge late={!!row.late} />
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteLog(row._logId as string)}
                            disabled={deletingLog === (row._logId as string)}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                          >
                            {deletingLog === (row._logId as string) ? "…" : "Delete"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Show more */}
          {hasMore && (
            <div className="p-4 border-t border-gray-100 text-center">
              <button
                onClick={() => setDisplayCount((c) => c + ITEMS_PER_PAGE)}
                className="text-sm text-purple-700 hover:text-purple-900 font-medium"
              >
                Show more ({filtered.length - displayCount} remaining)
              </button>
            </div>
          )}
        </div>

        {/* Leave section */}
        <LeaveSection
          staffUserId={id as Id<"users">}
          isAdmin={isAdmin}
          isOwnDashboard={isOwnDashboard}
        />
      </div>

      {/* Admin: Add Entry Modal */}
      <XModal
        open={showAddEntry}
        onClose={() => setShowAddEntry(false)}
        title="Add Attendance Entry"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowAddEntry(false)}>Cancel</Button>
            <Button loading={addingEntry} onClick={handleAddEntry}>Add Entry</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Manually record a clock-in for {staffName}.</p>
          <FormField label="Date" name="entryDate">
            <Input
              type="date"
              size="lg"
              value={addEntryForm.entryDate}
              max={todayString()}
              onChange={(e) => setAddEntryForm({ ...addEntryForm, entryDate: e.target.value })}
            />
          </FormField>
          <FormField label="Sign In Time (HH:mm)" name="entryTimeStr">
            <Input
              type="time"
              size="lg"
              value={addEntryForm.entryTimeStr}
              onChange={(e) => setAddEntryForm({ ...addEntryForm, entryTimeStr: e.target.value })}
            />
          </FormField>
        </div>
      </XModal>
    </div>
  );
}
