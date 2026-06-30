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

  const departmentsOrg = useQuery(
    api.departments.listByOrg,
    isAuthenticated && organizationId ? { organizationId } : "skip"
  );
  const departmentsLegacy = useQuery(
    api.departments.listByEmployer,
    isAuthenticated && !organizationId && employerId ? { employerId } : "skip"
  );
  const departments = (departmentsOrg ?? departmentsLegacy ?? null) as Dept[] | null;

  const createDeptOrg = useMutation(api.departments.createDepartmentInOrg);
  const createDeptLegacy = useMutation(api.departments.createDepartment);
  const updateDept = useMutation(api.departments.updateDepartment);
  const deleteDept = useMutation(api.departments.deleteDepartment);
  const updateTimeOrg = useMutation(api.settings.updateOrgSignInTime);
  const updateTimeLegacy = useMutation(api.settings.updateDefaultSignInTime);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateTime, setShowUpdateTime] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Dept | null>(null);
  const [deptName, setDeptName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [signInTime, setSignInTime] = useState("");
  const [loading, setLoading] = useState(false);

  const currentSignInTime = orgSettings?.defaultSignInTime ?? myAdminOrg?.defaultSignInTime ?? "09:00";

  const handleCreateDepartment = async () => {
    if (!deptName.trim()) { toast("Department name is required", "error"); return; }
    setLoading(true);
    try {
      if (organizationId) {
        await createDeptOrg({ organizationId, name: deptName });
      } else if (employerId) {
        await createDeptLegacy({ employerId, name: deptName });
      }
      toast("Department created!", "success");
      setShowCreateModal(false);
      setDeptName("");
    } catch { toast("Failed to create department", "error"); }
    finally { setLoading(false); }
  };

  const handleRename = async () => {
    if (!renameName.trim() || !selectedDept) return;
    setLoading(true);
    try {
      await updateDept({ departmentId: selectedDept._id, name: renameName });
      toast("Department renamed!", "success");
      setShowRenameModal(false);
    } catch { toast("Failed to rename department", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedDept) return;
    setLoading(true);
    try {
      await deleteDept({ departmentId: selectedDept._id });
      toast("Department deleted", "success");
      setShowDeleteConfirm(false);
    } catch { toast("Failed to delete department", "error"); }
    finally { setLoading(false); }
  };

  const handleSaveTime = async () => {
    if (!signInTime) { toast("Please select a time", "error"); return; }
    try {
      if (organizationId) {
        await updateTimeOrg({ organizationId, defaultSignInTime: signInTime });
      } else if (employerId) {
        await updateTimeLegacy({ employerId, defaultSignInTime: signInTime });
      }
      setShowUpdateTime(false);
      toast("Sign-in time updated!", "success");
    } catch { toast("Failed to update time", "error"); }
  };

  if (me === undefined || myAdminOrg === undefined) {
    return (
      <main className="p-4 md:p-10 flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading…</p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">User Management</h1>
          {myAdminOrg && (
            <p className="text-sm text-purple-700 font-medium">{myAdminOrg.name}</p>
          )}
          <p className="text-sm text-gray-500">Departments &amp; sign-in settings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => setShowUpdateTime(!showUpdateTime)} color="primary" size="lg" variant="soft">
            {showUpdateTime ? "Cancel" : "Change Sign-in Time"}
          </Button>
          <Button color="primary" size="lg" onClick={() => setShowCreateModal(true)}>
            + New Department
          </Button>
        </div>
      </div>

      {/* Sign-in time panel */}
      {showUpdateTime && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-medium text-purple-800">Default sign-in deadline</p>
            <p className="text-xs text-purple-600">
              Current: <strong>{currentSignInTime}</strong> — staff who sign in after this time are marked Late
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <XDropdown
              placeholder="Select new time"
              items={morningTimes}
              onSelect={(val) => setSignInTime(String(val.value ?? ""))}
            />
            <Button color="primary" size="lg" onClick={handleSaveTime} disabled={!signInTime}>
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Department list */}
      <div className="space-y-2">
        {departments === null ? (
          <p className="text-gray-400 text-sm text-center py-12">Loading departments…</p>
        ) : departments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">No departments yet.</p>
            <Button onClick={() => setShowCreateModal(true)} color="primary" size="md">
              Create first department
            </Button>
          </div>
        ) : (
          departments.map((dept) => (
            <div
              key={dept._id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              <span className="font-medium text-gray-800">{dept.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedDept(dept); setRenameName(dept.name); setShowRenameModal(true); }}
                  className="text-xs text-blue-600 hover:underline px-2 py-1"
                >
                  Rename
                </button>
                <button
                  onClick={() => { setSelectedDept(dept); setShowDeleteConfirm(true); }}
                  className="text-xs text-red-500 hover:underline px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Department Modal */}
      <XModal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); setDeptName(""); }}
        title="Create Department"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button size="lg" color="primary" loading={loading} onClick={handleCreateDepartment}>Create</Button>
          </div>
        }
      >
        <FormField label="Department Name" name="deptName">
          <Input
            placeholder="e.g. Engineering, Marketing…"
            size="lg"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateDepartment()}
          />
        </FormField>
      </XModal>

      {/* Rename Modal */}
      <XModal
        open={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        title={`Rename "${selectedDept?.name}"`}
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowRenameModal(false)}>Cancel</Button>
            <Button size="lg" color="primary" loading={loading} onClick={handleRename}>Save</Button>
          </div>
        }
      >
        <FormField label="New name" name="renameName">
          <Input
            size="lg"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
          />
        </FormField>
      </XModal>

      {/* Delete Confirm Modal */}
      <XModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Department"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button size="lg" color="red" loading={loading} onClick={handleDelete}>Delete</Button>
          </div>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete <strong>{selectedDept?.name}</strong>?
          Staff currently assigned to this department will be unassigned.
        </p>
      </XModal>
    </main>
  );
}
