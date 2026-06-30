"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction, useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { XModal } from "@/components/XModal";
import { XDropdown } from "@/components/XDropdown";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { toast } from "@/lib/toast";

// ── Stat card ────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
  trendColor,
  sub,
}: {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendColor?: string;
  sub?: string;
}) {
  return (
    <div
      className="p-6 rounded-xl border bento-card"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "rgba(191,201,195,0.3)",
        boxShadow: "0 2px 10px rgba(6,78,59,0.04)",
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-lg" style={{ backgroundColor: iconBg }}>
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ color: iconColor, fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        {trend && (
          <span
            className="text-xs font-mono"
            style={{ color: trendColor ?? "#707974" }}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm mb-1" style={{ color: "#707974" }}>{label}</p>
      <p
        className="text-4xl font-bold leading-none"
        style={{ fontFamily: "var(--font-hanken, sans-serif)", color: "#003527" }}
      >
        {value}
      </p>
      {sub && <p className="text-xs mt-3" style={{ color: "#707974" }}>{sub}</p>}
    </div>
  );
}

// ── Inner page ───────────────────────────────────────────────────

function DashboardEmployerInner() {
  const router = useRouter();
  const params = useSearchParams();
  const orgIdParam = params.get("org") as Id<"organizations"> | null;
  const { isAuthenticated } = useConvexAuth();

  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const myAdminOrg = useQuery(api.organizations.getMyAdminOrg, isAuthenticated ? {} : "skip");
  const organizationId = orgIdParam ?? myAdminOrg?._id ?? null;

  const isAllowed =
    me?.platformRole === "superAdmin" || me?.role === "admin" || me?.role === "manager";

  useEffect(() => {
    if (me === undefined || myAdminOrg === undefined) return;
    if (me === null) { router.replace("/login"); return; }
    if (!isAllowed) router.replace(`/dashboardStaff/${me._id}`);
  }, [me, myAdminOrg, isAllowed, router]);

  const employerId = me?._id as Id<"users"> | undefined;

  const staffListOrg = useQuery(
    api.staff.listStaffByOrg,
    isAuthenticated && organizationId ? { organizationId } : "skip"
  );
  const staffListLegacy = useQuery(
    api.staff.listStaffByEmployer,
    isAuthenticated && !organizationId && employerId ? { employerId } : "skip"
  );
  const staffList = staffListOrg ?? staffListLegacy ?? null;

  const departmentsOrg = useQuery(
    api.departments.listByOrg,
    isAuthenticated && organizationId ? { organizationId } : "skip"
  );
  const departmentsLegacy = useQuery(
    api.departments.listByEmployer,
    isAuthenticated && !organizationId && employerId ? { employerId } : "skip"
  );
  const departments = departmentsOrg ?? departmentsLegacy ?? null;

  const today = new Date().toISOString().slice(0, 10);
  const dailySummaryOrg = useQuery(
    api.attendance.getOrgDailySummary,
    isAuthenticated && organizationId ? { organizationId, date: today } : "skip"
  );
  const dailySummaryLegacy = useQuery(
    api.attendance.getEmployerDailySummary,
    isAuthenticated && !organizationId && employerId ? { employerId, date: today } : "skip"
  );
  const dailySummary = dailySummaryOrg ?? dailySummaryLegacy ?? null;

  const pendingLeaveCount = useQuery(
    api.leave.getPendingLeaveCount,
    isAuthenticated && organizationId ? { organizationId } : "skip"
  );

  const createStaffOrg = useMutation(api.staff.createStaffInOrg);
  const createStaffLegacy = useMutation(api.staff.createStaffFromDashboard);
  const deleteStaffMutation = useMutation(api.staff.removeStaffByUserId);
  const setOrgMemberRole = useMutation(api.organizations.setOrgMemberRole);
  const inviteByEmail = useAction(api.invites.inviteStaffByEmail);
  const invitePending = useAction(api.invites.invitePendingStaff);

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<{
    _id: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    department: "",
  });
  const [inviteEmail, setInviteEmail] = useState("");

  const staffData = (staffList ?? []).map((x) => ({
    ...x,
    _id: x.userId,
    lastEntryTime: x.lastEntryTime
      ? new Date(x.lastEntryTime).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })
      : "N/A",
    inviteStatus: x.needsInvite ? "Pending Invite" : "Active",
  }));

  const departmentItems = (departments ?? []).map((d) => ({ name: d.name, id: d._id }));
  const pendingInviteCount = (staffList ?? []).filter((s) => s.needsInvite).length;

  const totalStaff = staffData.length;
  const presentToday = dailySummary?.uniqueStaffSignedIn ?? 0;
  const onTimeToday = dailySummary?.onTime ?? 0;
  const lateToday = dailySummary?.late ?? 0;
  const absentToday = Math.max(0, totalStaff - presentToday);

  const handleInviteStaff = async (email: string) => {
    setLoading(true);
    try {
      const result = await inviteByEmail({ email, organizationId: organizationId ?? undefined });
      if (result.success) toast(`Invitation sent to ${email}`, "success");
      else toast(result.message, "error");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to send invite", "error");
    } finally { setLoading(false); }
  };

  const handleToggleRole = async (userId: string, orgRole: string | undefined) => {
    if (!organizationId) return;
    const newRole = orgRole === "admin" ? "staff" : "admin";
    try {
      await setOrgMemberRole({ organizationId, userId: userId as Id<"users">, orgRole: newRole });
      toast(`Role updated to ${newRole}`, "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Failed to update role", "error"); }
  };

  const handleCreate = async () => {
    if (!organizationId && !employerId) return;
    setLoading(true);
    try {
      if (organizationId) {
        await createStaffOrg({
          organizationId,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          jobTitle: form.role,
          departmentId: (form.department || undefined) as Id<"departments"> | undefined,
        });
      } else {
        await createStaffLegacy({
          employerId: employerId!,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          role: form.role,
          departmentId: (form.department || undefined) as Id<"departments"> | undefined,
        });
      }
      try {
        const invite = await inviteByEmail({ email: form.email.trim(), organizationId: organizationId ?? undefined });
        if (invite.success) toast(`Employee created and invitation sent to ${form.email}`, "success");
        else toast(`Employee created, but invite failed: ${invite.message}`, "error");
      } catch {
        toast("Employee created, but invite email failed — use Send Invite to retry", "error");
      }
      setShowAddModal(false);
      setForm({ firstName: "", lastName: "", email: "", role: "", department: "" });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to create employee", "error");
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedForDelete) return;
    setLoading(true);
    try {
      await deleteStaffMutation({ userId: selectedForDelete._id as Id<"users"> });
      toast("Employee successfully deleted", "success");
    } catch { toast("Error deleting employee", "error"); }
    finally { setLoading(false); setShowDeleteModal(false); setSelectedForDelete(null); }
  };

  const handleInviteOne = async () => {
    if (!inviteEmail.trim()) { toast("Enter an email address", "error"); return; }
    setLoading(true);
    try {
      const result = await inviteByEmail({ email: inviteEmail.trim(), organizationId: organizationId ?? undefined });
      if (result.success) { toast(`Invitation sent to ${result.email}`, "success"); setInviteEmail(""); }
      else toast(result.message, "error");
    } catch (e) { toast(e instanceof Error ? e.message : "Failed to send invite", "error"); }
    finally { setLoading(false); }
  };

  const handleInviteAll = async () => {
    setLoading(true);
    try {
      const result = await invitePending({ organizationId: organizationId ?? undefined });
      if (result.invited > 0) toast(`Sent ${result.invited} invitation${result.invited !== 1 ? "s" : ""}`, "success");
      if (result.failed > 0) toast(`${result.failed} invite${result.failed !== 1 ? "s" : ""} failed`, "error");
      if (result.invited === 0 && result.failed === 0) toast("No pending staff to invite", "error");
    } catch (e) { toast(e instanceof Error ? e.message : "Failed to send invites", "error"); }
    finally { setLoading(false); }
  };

  if (me === undefined || myAdminOrg === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6faf7" }}>
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
          <p style={{ color: "#707974", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "12px" }}>Loading workspace…</p>
        </div>
      </div>
    );
  }

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f6faf7" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ backgroundColor: "#f6faf7", borderColor: "rgba(191,201,195,0.4)", boxShadow: "0 1px 12px rgba(6,78,59,0.04)" }}
      >
        <div className="flex justify-between items-center h-16 px-6">
          <div>
            <h1 className="font-bold text-xl leading-none" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
              Dashboard
            </h1>
            <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
              {dateStr}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(pendingLeaveCount ?? 0) > 0 && (
              <button
                onClick={() => router.push("/leave-requests")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{ backgroundColor: "#ffdbd0", color: "#832600" }}
              >
                <span className="material-symbols-outlined text-[16px]">event_busy</span>
                {pendingLeaveCount} Leave
              </button>
            )}
            <button
              onClick={() => router.push("/reports")}
              className="p-2 rounded-full transition-all"
              style={{ color: "#707974" }}
              title="Reports"
            >
              <span className="material-symbols-outlined text-[22px]">analytics</span>
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="p-2 rounded-full transition-all"
              style={{ color: "#707974" }}
              title="Send Invite"
            >
              <span className="material-symbols-outlined text-[22px]">forward_to_inbox</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ backgroundColor: "#003527", color: "#ffffff" }}
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add Staff
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Org greeting */}
        {myAdminOrg && (
          <div
            className="rounded-xl p-6 relative overflow-hidden"
            style={{ backgroundColor: "#064e3b" }}
          >
            <div className="relative z-10">
              <p className="text-xs mb-1" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#80bea6", letterSpacing: "0.08em" }}>
                WELCOME BACK
              </p>
              <h2 className="text-2xl font-bold" style={{ color: "#ffffff", fontFamily: "var(--font-hanken, sans-serif)" }}>
                {myAdminOrg.name}
              </h2>
              <p className="text-sm mt-1" style={{ color: "#80bea6" }}>
                {totalStaff} staff member{totalStaff !== 1 ? "s" : ""} · {presentToday} present today
              </p>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10" style={{ transform: "translate(25%, 25%)" }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: "160px", fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
          </div>
        )}

        {/* Summary bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Present Today"
            value={presentToday}
            icon="check_circle"
            iconBg="#b0f0d6"
            iconColor="#003527"
            trend={`${totalStaff > 0 ? Math.round((presentToday / totalStaff) * 100) : 0}%`}
            trendColor="#0b513d"
            sub="Clocked in today"
          />
          <StatCard
            label="On Time"
            value={onTimeToday}
            icon="schedule"
            iconBg="#bbf37c"
            iconColor="#1c3400"
            trend={presentToday > 0 ? `${Math.round((onTimeToday / presentToday) * 100)}%` : undefined}
            trendColor="#2e4f00"
            sub="Within deadline"
          />
          <StatCard
            label="Late"
            value={lateToday}
            icon="alarm_on"
            iconBg="#ffdbd0"
            iconColor="#ac3400"
            trend={lateToday > 0 ? "Needs attention" : "All good"}
            trendColor={lateToday > 0 ? "#ac3400" : "#0b513d"}
            sub="After sign-in time"
          />
          <StatCard
            label="Absent"
            value={absentToday}
            icon="person_off"
            iconBg="#ffdad6"
            iconColor="#ba1a1a"
            trend={pendingLeaveCount ? `${pendingLeaveCount} pending leave` : undefined}
            trendColor="#93000a"
            sub="Not signed in"
          />
        </div>

        {/* Quick actions + staff table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick management panel */}
          <div
            className="rounded-xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: "#064e3b" }}
          >
            <h3 className="font-bold text-lg" style={{ color: "#ffffff", fontFamily: "var(--font-hanken, sans-serif)" }}>
              Quick Management
            </h3>
            <p className="text-sm opacity-70" style={{ color: "#b0f0d6" }}>
              Common admin tasks
            </p>
            {[
              { icon: "person_add", label: "Add Employee", action: () => setShowAddModal(true) },
              { icon: "forward_to_inbox", label: "Send Invite", action: () => setShowInviteModal(true) },
              { icon: "analytics", label: "View Reports", action: () => router.push("/reports") },
              { icon: "history", label: "Audit Log", action: () => router.push("/audit-log") },
              ...(pendingLeaveCount ? [{ icon: "event_busy", label: `Leave (${pendingLeaveCount})`, action: () => router.push("/leave-requests") }] : []),
            ].map(({ icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group text-left"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.18)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)"; }}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]" style={{ color: "#b0f0d6" }}>{icon}</span>
                  <span className="text-sm font-medium" style={{ color: "#ffffff", fontFamily: "var(--font-hanken, sans-serif)" }}>{label}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#b0f0d6" }}>arrow_forward</span>
              </button>
            ))}
          </div>

          {/* Staff table */}
          <div
            className="lg:col-span-3 rounded-xl border overflow-hidden"
            style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)", boxShadow: "0 2px 10px rgba(6,78,59,0.04)" }}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "#f6faf7" }}>
              <div>
                <h3 className="font-bold text-base" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Live Attendance</h3>
                <p className="text-xs mt-0.5" style={{ color: "#707974" }}>Staff present today</p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-mono"
                style={{ backgroundColor: "#b0f0d6", color: "#0b513d" }}
              >
                {staffData.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              {staffData.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-[48px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>group</span>
                  <p className="text-sm" style={{ color: "#707974" }}>No staff added yet.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 rounded-lg text-sm font-bold"
                    style={{ backgroundColor: "#003527", color: "#ffffff" }}
                  >
                    Add First Employee
                  </button>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: "#f6faf7", borderBottom: "1px solid rgba(191,201,195,0.2)" }}>
                      {["Staff Name", "Role / Dept", "Last Sign In", "Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left"
                          style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.06em", color: "#707974", textTransform: "uppercase" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staffData.map((row) => (
                      <tr
                        key={row._id as string}
                        className="border-b transition-colors"
                        style={{ borderColor: "rgba(191,201,195,0.15)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(241,245,242,0.6)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                              style={{ backgroundColor: "#b0f0d6", color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}
                            >
                              {String(row.firstName ?? "?")[0]}{String(row.lastName ?? "")[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-sm leading-none" style={{ color: "#181d1b" }}>
                                {row.firstName} {row.lastName}
                              </p>
                              <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                                {row.email as string}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: "#404944" }}>
                            {(row.jobTitle as string) || (row.role as string) || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                            {row.lastEntryTime as string}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono"
                            style={
                              row.inviteStatus === "Active"
                                ? { backgroundColor: "#b0f0d6", color: "#0b513d" }
                                : { backgroundColor: "#ffdbd0", color: "#832600" }
                            }
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full inline-block"
                              style={{ backgroundColor: row.inviteStatus === "Active" ? "#0b513d" : "#832600" }}
                            />
                            {row.inviteStatus as string}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => router.push(`/dashboardStaff/${row._id as string}`)}
                              className="p-1.5 rounded-lg transition-all"
                              title="View"
                              style={{ color: "#707974" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#003527"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#707974"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                            {row.needsInvite && (
                              <button
                                onClick={() => handleInviteStaff(row.email as string)}
                                className="p-1.5 rounded-lg transition-all"
                                title="Send Invite"
                                style={{ color: "#707974" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ac3400"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffdbd0"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#707974"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                              >
                                <span className="material-symbols-outlined text-[18px]">mail</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleRole(row._id as string, row.orgRole as string | undefined)}
                              className="p-1.5 rounded-lg transition-all"
                              title={row.orgRole === "admin" ? "Demote to Staff" : "Promote to Admin"}
                              style={{ color: "#707974" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#003527"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#707974"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                            >
                              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                            </button>
                            <button
                              onClick={() => { setSelectedForDelete(row as never); setShowDeleteModal(true); }}
                              className="p-1.5 rounded-lg transition-all"
                              title="Delete"
                              style={{ color: "#707974" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ba1a1a"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffdad6"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#707974"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <XModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setForm({ firstName: "", lastName: "", email: "", role: "", department: "" }); }}
        title="Add New Employee"
        size="2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button loading={loading} onClick={handleCreate}>Create Employee</Button>
          </div>
        }
      >
        <div className="space-y-5 w-full">
          <FormField label="First Name" name="firstName">
            <Input placeholder="First Name" size="lg" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </FormField>
          <FormField label="Last Name" name="lastName">
            <Input placeholder="Last Name" size="lg" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </FormField>
          <FormField label="Email" name="email">
            <Input type="email" placeholder="Email Address" size="lg" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Role / Job Title" name="role">
            <Input placeholder="e.g. Software Engineer" size="lg" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </FormField>
          <FormField label="Department" name="department">
            <XDropdown items={departmentItems} onSelect={(val) => setForm({ ...form, department: String(val.id ?? "") })} />
          </FormField>
        </div>
      </XModal>

      {/* Invite Modal */}
      <XModal
        open={showInviteModal}
        onClose={() => { setShowInviteModal(false); setInviteEmail(""); }}
        title="Send Staff Invites"
        size="lg"
        footer={<div className="flex justify-end gap-3"><Button color="gray" variant="soft" onClick={() => setShowInviteModal(false)}>Close</Button></div>}
      >
        <div className="space-y-6">
          <p className="text-gray-600 text-sm">Invite staff to create their account. They will receive an email to set their password.</p>
          <FormField label="Email" name="inviteEmail">
            <Input type="email" placeholder="staff@company.com" size="lg" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          </FormField>
          <Button loading={loading} onClick={handleInviteOne} className="w-full">Send Invitation</Button>
          {pendingInviteCount > 0 && (
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-3">{pendingInviteCount} staff member{pendingInviteCount !== 1 ? "s" : ""} haven&apos;t been invited yet.</p>
              <Button loading={loading} variant="outline" onClick={handleInviteAll} className="w-full">Invite All Pending Staff</Button>
            </div>
          )}
        </div>
      </XModal>

      {/* Delete Modal */}
      <XModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Employee"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button color="red" loading={loading} onClick={handleDelete}>Delete Employee</Button>
          </div>
        }
      >
        <div className="p-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <strong>{selectedForDelete?.firstName} {selectedForDelete?.lastName}</strong>? This action cannot be undone.
          </p>
        </div>
      </XModal>
    </div>
  );
}

export default function DashboardEmployerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6faf7" }}>
        <span className="material-symbols-outlined text-[48px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
      </div>
    }>
      <DashboardEmployerInner />
    </Suspense>
  );
}
