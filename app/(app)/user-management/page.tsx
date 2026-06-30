"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { XModal } from "@/components/XModal";
import { XDropdown } from "@/components/XDropdown";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { toast } from "@/lib/toast";

const morningTimes = [
  { value: "06:00", name: "6:00 AM", id: "06:00" },
  { value: "07:00", name: "7:00 AM", id: "07:00" },
  { value: "08:00", name: "8:00 AM", id: "08:00" },
  { value: "09:00", name: "9:00 AM", id: "09:00" },
];

type Dept = { _id: Id<"departments">; name: string; organizationId?: Id<"organizations"> };

const DEPT_ICON_COLORS = [
  { bg: "#b0f0d6", color: "#003527" },
  { bg: "#bbf37c", color: "#1c3400" },
  { bg: "#ffdbd0", color: "#832600" },
  { bg: "#ebefec", color: "#404944" },
  { bg: "#ffdad6", color: "#93000a" },
];

export default function UserManagementPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const myAdminOrg = useQuery(api.organizations.getMyAdminOrg, isAuthenticated ? {} : "skip");
  const orgSettings = useQuery(
    api.settings.getOrgSettings,
    isAuthenticated && myAdminOrg?._id ? { organizationId: myAdminOrg._id } : "skip"
  );

  const isSuperAdmin = me?.platformRole === "superAdmin";
  const isAdmin = me?.role === "admin";

  useEffect(() => {
    if (me === undefined || myAdminOrg === undefined) return;
    if (me === null) { router.replace("/login"); return; }
    if (isSuperAdmin) { router.replace("/superAdmin"); return; }
    if (!isAdmin) { router.replace(`/dashboardStaff/${me._id}`); return; }
  }, [me, myAdminOrg, isSuperAdmin, isAdmin, router]);

  const organizationId = myAdminOrg?._id ?? null;
  const employerId = me?._id as Id<"users"> | undefined;

  const departmentsOrg = useQuery(api.departments.listByOrg, isAuthenticated && organizationId ? { organizationId } : "skip");
  const departmentsLegacy = useQuery(api.departments.listByEmployer, isAuthenticated && !organizationId && employerId ? { employerId } : "skip");
  const departments = (departmentsOrg ?? departmentsLegacy ?? null) as Dept[] | null;

  const createDeptOrg = useMutation(api.departments.createDepartmentInOrg);
  const createDeptLegacy = useMutation(api.departments.createDepartment);
  const updateDept = useMutation(api.departments.updateDepartment);
  const deleteDept = useMutation(api.departments.deleteDepartment);
  const updateTimeOrg = useMutation(api.settings.updateOrgSignInTime);
  const updateTimeLegacy = useMutation(api.settings.updateDefaultSignInTime);
  const updateDeptSignInTime = useMutation(api.departments.updateDepartmentSignInTime);
  const updateNotifSettings = useMutation(api.settings.updateOrgNotificationSettings);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateTime, setShowUpdateTime] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeptTimeModal, setShowDeptTimeModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Dept | null>(null);
  const [deptName, setDeptName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [signInTime, setSignInTime] = useState("");
  const [deptSignInTime, setDeptSignInTime] = useState("");
  const [loading, setLoading] = useState(false);

  const [notifDailyDigest, setNotifDailyDigest] = useState(false);
  const [notifLateAlert, setNotifLateAlert] = useState(false);
  const [notifEmail, setNotifEmail] = useState("");
  const [savingNotif, setSavingNotif] = useState(false);

  useEffect(() => {
    if (orgSettings) {
      setNotifDailyDigest(orgSettings.dailyDigestEnabled ?? false);
      setNotifLateAlert(orgSettings.lateAlertEnabled ?? false);
      setNotifEmail(orgSettings.notificationEmail ?? "");
    }
  }, [orgSettings]);

  const currentSignInTime = orgSettings?.defaultSignInTime ?? myAdminOrg?.defaultSignInTime ?? "09:00";

  const handleCreateDepartment = async () => {
    if (!deptName.trim()) { toast("Department name is required", "error"); return; }
    setLoading(true);
    try {
      if (organizationId) await createDeptOrg({ organizationId, name: deptName });
      else if (employerId) await createDeptLegacy({ employerId, name: deptName });
      toast("Department created!", "success");
      setShowCreateModal(false); setDeptName("");
    } catch { toast("Failed to create department", "error"); }
    finally { setLoading(false); }
  };

  const handleRename = async () => {
    if (!renameName.trim() || !selectedDept) return;
    setLoading(true);
    try {
      await updateDept({ departmentId: selectedDept._id, name: renameName });
      toast("Department renamed!", "success"); setShowRenameModal(false);
    } catch { toast("Failed to rename department", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedDept) return;
    setLoading(true);
    try {
      await deleteDept({ departmentId: selectedDept._id });
      toast("Department deleted", "success"); setShowDeleteConfirm(false);
    } catch { toast("Failed to delete department", "error"); }
    finally { setLoading(false); }
  };

  const handleSaveTime = async () => {
    if (!signInTime) { toast("Please select a time", "error"); return; }
    try {
      if (organizationId) await updateTimeOrg({ organizationId, defaultSignInTime: signInTime });
      else if (employerId) await updateTimeLegacy({ employerId, defaultSignInTime: signInTime });
      setShowUpdateTime(false); toast("Sign-in time updated!", "success");
    } catch { toast("Failed to update time", "error"); }
  };

  const handleSaveDeptTime = async () => {
    if (!selectedDept) return;
    setLoading(true);
    try {
      await updateDeptSignInTime({ departmentId: selectedDept._id, defaultSignInTime: deptSignInTime || null });
      toast("Department sign-in time updated!", "success"); setShowDeptTimeModal(false);
    } catch { toast("Failed to update", "error"); }
    finally { setLoading(false); }
  };

  const handleSaveNotifSettings = async () => {
    if (!organizationId) return;
    setSavingNotif(true);
    try {
      await updateNotifSettings({ organizationId, dailyDigestEnabled: notifDailyDigest, lateAlertEnabled: notifLateAlert, notificationEmail: notifEmail || undefined });
      toast("Notification settings saved!", "success");
    } catch { toast("Failed to save settings", "error"); }
    finally { setSavingNotif(false); }
  };

  if (me === undefined || myAdminOrg === undefined) {
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
          <div>
            <h1 className="font-bold text-xl leading-none" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
              Workforce Management
            </h1>
            {myAdminOrg && <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{myAdminOrg.name}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpdateTime(!showUpdateTime)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all border"
              style={{ borderColor: "rgba(191,201,195,0.5)", color: "#003527" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              {showUpdateTime ? "Cancel" : "Sign-in Time"}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ backgroundColor: "#003527", color: "#ffffff" }}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Department
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Sign-in time panel */}
        {showUpdateTime && (
          <div
            className="rounded-xl border p-6 flex flex-col sm:flex-row sm:items-center gap-5"
            style={{ backgroundColor: "#064e3b", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "#ffffff" }}>Default Sign-in Deadline</p>
              <p className="text-sm mt-1" style={{ color: "#80bea6" }}>
                Current: <span className="font-mono font-bold" style={{ color: "#b0f0d6" }}>{currentSignInTime}</span> — staff who sign in after this time are marked Late.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <XDropdown
                placeholder="Select new time"
                items={morningTimes}
                onSelect={(val) => setSignInTime(String(val.value ?? ""))}
              />
              <button
                onClick={handleSaveTime}
                disabled={!signInTime}
                className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-40"
                style={{ backgroundColor: "#b0f0d6", color: "#003527" }}
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Departments table */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
              <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "#f6faf7" }}>
                <h2 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Active Departments</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: "#ebefec", color: "#707974" }}>
                  {departments?.length ?? 0}
                </span>
              </div>

              {departments === null ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-[40px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
                </div>
              ) : departments.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f1f5f2" }}>
                    <span className="material-symbols-outlined text-[32px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
                  </div>
                  <p className="font-semibold" style={{ color: "#003527" }}>No departments yet</p>
                  <p className="text-sm text-center px-8" style={{ color: "#707974" }}>
                    Create departments to organize your team and set custom sign-in deadlines.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm"
                    style={{ backgroundColor: "#ac3400", color: "#ffffff" }}
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Create First Department
                  </button>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ backgroundColor: "rgba(241,245,242,0.6)", borderBottom: "1px solid rgba(191,201,195,0.2)" }}>
                      {["Department", "Sign-in Deadline", "Members", ""].map((h) => (
                        <th key={h} className="px-6 py-4" style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.06em", color: "#707974", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept, i) => {
                      const deptWithTime = dept as Dept & { defaultSignInTime?: string };
                      const palette = DEPT_ICON_COLORS[i % DEPT_ICON_COLORS.length];
                      return (
                        <tr
                          key={dept._id}
                          className="border-b transition-colors"
                          style={{ borderColor: "rgba(191,201,195,0.15)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(241,245,242,0.5)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: palette.bg }}>
                                <span className="material-symbols-outlined text-[18px]" style={{ color: palette.color }}>corporate_fare</span>
                              </div>
                              <span className="font-semibold text-sm" style={{ color: "#181d1b" }}>{dept.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]" style={{ color: "#707974" }}>schedule</span>
                              <span className="text-sm font-mono" style={{ color: deptWithTime.defaultSignInTime ? "#003527" : "#bfc9c3" }}>
                                {deptWithTime.defaultSignInTime ?? "org default"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-xs px-2.5 py-1 rounded-full font-mono" style={{ backgroundColor: "#b0f0d6", color: "#0b513d" }}>Active</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => { setSelectedDept(dept); setDeptSignInTime(deptWithTime.defaultSignInTime ?? ""); setShowDeptTimeModal(true); }}
                                className="p-1.5 rounded-lg transition-all"
                                title="Set sign-in time"
                                style={{ color: "#707974" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#003527"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#707974"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                              >
                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                              </button>
                              <button
                                onClick={() => { setSelectedDept(dept); setRenameName(dept.name); setShowRenameModal(true); }}
                                className="p-1.5 rounded-lg transition-all"
                                title="Rename"
                                style={{ color: "#707974" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#003527"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#707974"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button
                                onClick={() => { setSelectedDept(dept); setShowDeleteConfirm(true); }}
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
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Sidebar: org settings */}
          <div className="flex flex-col gap-6">
            {/* Org info card */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-[20px]" style={{ color: "#ac3400" }}>tune</span>
                <h3 className="font-bold" style={{ color: "#181d1b", fontFamily: "var(--font-hanken, sans-serif)" }}>Org Settings</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Organization</p>
                  <p className="font-semibold" style={{ color: "#003527" }}>{myAdminOrg?.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Default Sign-in</p>
                  <p className="font-mono font-bold" style={{ color: "#003527" }}>{currentSignInTime}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Departments</p>
                  <p className="font-semibold" style={{ color: "#003527" }}>{departments?.length ?? 0}</p>
                </div>
              </div>
            </div>

            {/* Notification settings */}
            {organizationId && (
              <div className="rounded-xl border p-6" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-[20px]" style={{ color: "#003527" }}>notifications</span>
                  <h3 className="font-bold" style={{ color: "#181d1b", fontFamily: "var(--font-hanken, sans-serif)" }}>Notifications</h3>
                </div>
                <p className="text-xs mb-5" style={{ color: "#707974" }}>
                  Toggle notifications — preferences are saved and take effect once email sending is configured.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Daily attendance digest", desc: "Sent each morning with present / late / absent counts", value: notifDailyDigest, setter: setNotifDailyDigest },
                    { label: "Late arrival alerts", desc: "Instant alert when a staff member clocks in late", value: notifLateAlert, setter: setNotifLateAlert },
                  ].map(({ label, desc, value, setter }) => (
                    <label key={label} className="flex items-start gap-3 cursor-pointer">
                      <div className="relative mt-0.5">
                        <input type="checkbox" checked={value} onChange={(e) => setter(e.target.checked)} className="sr-only" />
                        <div
                          className="w-10 h-6 rounded-full transition-colors cursor-pointer"
                          style={{ backgroundColor: value ? "#003527" : "#dfe3e1" }}
                          onClick={() => setter(!value)}
                        >
                          <div
                            className="w-4 h-4 bg-white rounded-full mt-1 transition-transform shadow-sm"
                            style={{ transform: value ? "translateX(20px)" : "translateX(4px)" }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#181d1b" }}>{label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#707974" }}>{desc}</p>
                      </div>
                    </label>
                  ))}
                  <div>
                    <p className="text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Notification email</p>
                    <input
                      type="email"
                      value={notifEmail}
                      onChange={(e) => setNotifEmail(e.target.value)}
                      placeholder="notifications@company.com"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                      style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b" }}
                    />
                  </div>
                  <button
                    onClick={handleSaveNotifSettings}
                    disabled={savingNotif}
                    className="w-full py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-60"
                    style={{ backgroundColor: "#003527", color: "#ffffff" }}
                  >
                    {savingNotif ? "Saving…" : "Save Settings"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <XModal open={showCreateModal} onClose={() => { setShowCreateModal(false); setDeptName(""); }} title="Create Department"
        footer={<div className="flex justify-end gap-3"><Button color="gray" variant="soft" onClick={() => setShowCreateModal(false)}>Cancel</Button><Button size="lg" color="primary" loading={loading} onClick={handleCreateDepartment}>Create</Button></div>}
      >
        <FormField label="Department Name" name="deptName">
          <Input placeholder="e.g. Engineering, Marketing…" size="lg" value={deptName} onChange={(e) => setDeptName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreateDepartment()} />
        </FormField>
      </XModal>

      <XModal open={showRenameModal} onClose={() => setShowRenameModal(false)} title={`Rename "${selectedDept?.name}"`}
        footer={<div className="flex justify-end gap-3"><Button color="gray" variant="soft" onClick={() => setShowRenameModal(false)}>Cancel</Button><Button size="lg" color="primary" loading={loading} onClick={handleRename}>Save</Button></div>}
      >
        <FormField label="New name" name="renameName">
          <Input size="lg" value={renameName} onChange={(e) => setRenameName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleRename()} />
        </FormField>
      </XModal>

      <XModal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Department"
        footer={<div className="flex justify-end gap-3"><Button color="gray" variant="soft" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button><Button size="lg" color="red" loading={loading} onClick={handleDelete}>Delete</Button></div>}
      >
        <p className="text-gray-700 p-2">
          Are you sure you want to delete <strong>{selectedDept?.name}</strong>? Staff currently assigned to this department will be unassigned.
        </p>
      </XModal>

      <XModal open={showDeptTimeModal} onClose={() => setShowDeptTimeModal(false)} title={`Sign-in Time — ${selectedDept?.name}`}
        footer={<div className="flex justify-end gap-3"><Button color="gray" variant="soft" onClick={() => setShowDeptTimeModal(false)}>Cancel</Button><Button size="lg" color="primary" loading={loading} onClick={handleSaveDeptTime}>Save</Button></div>}
      >
        <div className="space-y-4 p-2">
          <p className="text-sm text-gray-500">Set a custom sign-in deadline for this department. Leave blank to use the org default.</p>
          <FormField label="Sign-in deadline (HH:mm)" name="deptSignInTime">
            <Input type="time" size="lg" value={deptSignInTime} onChange={(e) => setDeptSignInTime(e.target.value)} placeholder="e.g. 09:00" />
          </FormField>
          {deptSignInTime && (
            <button onClick={() => setDeptSignInTime("")} className="text-xs text-gray-400 hover:text-red-500">Clear (use org default)</button>
          )}
        </div>
      </XModal>
    </div>
  );
}
