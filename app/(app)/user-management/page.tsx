"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { XTable } from "@/components/XTable";
import { XModal } from "@/components/XModal";
import { XDropdown } from "@/components/XDropdown";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { toast } from "@/lib/toast";

const columns = [
  { key: "name", label: "Department Name", id: "name" },
  { key: "_id", label: "Department ID", id: "_id" },
  { key: "actions", label: "Actions", id: "actions" },
];

const morningTimes = [
  { value: "06:00", name: "6:00 AM", id: "06:00" },
  { value: "07:00", name: "7:00 AM", id: "07:00" },
  { value: "08:00", name: "8:00 AM", id: "08:00" },
  { value: "09:00", name: "9:00 AM", id: "09:00" },
];

export default function UserManagementPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const myAdminOrg = useQuery(
    api.organizations.getMyAdminOrg,
    isAuthenticated ? {} : "skip"
  );

  const isSuperAdmin = me?.platformRole === "superAdmin";
  const isAdmin = me?.role === "admin";

  useEffect(() => {
    if (me === undefined || myAdminOrg === undefined) return;
    if (me === null) { router.replace("/login"); return; }
    // super admins don't use this page; pure staff shouldn't access it
    if (isSuperAdmin) { router.replace("/superAdmin"); return; }
    if (!isAdmin) { router.replace(`/dashboardStaff/${me._id}`); return; }
  }, [me, myAdminOrg, isSuperAdmin, isAdmin, router]);

  const organizationId = myAdminOrg?._id ?? null;
  const employerId = me?._id as Id<"users"> | undefined;

  // Prefer org model, fall back to legacy employerId
  const departmentsOrg = useQuery(
    api.departments.listByOrg,
    isAuthenticated && organizationId ? { organizationId } : "skip"
  );
  const departmentsLegacy = useQuery(
    api.departments.listByEmployer,
    isAuthenticated && !organizationId && employerId ? { employerId } : "skip"
  );
  const departments = departmentsOrg ?? departmentsLegacy ?? null;

  const createDeptOrg = useMutation(api.departments.createDepartmentInOrg);
  const createDeptLegacy = useMutation(api.departments.createDepartment);
  const updateTimeOrg = useMutation(api.settings.updateOrgSignInTime);
  const updateTimeLegacy = useMutation(api.settings.updateDefaultSignInTime);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpdateTime, setShowUpdateTime] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [signInTime, setSignInTime] = useState("");
  const [loading, setLoading] = useState(false);

  const deptData = (departments ?? []) as Record<string, unknown>[];
  const paginationData = { page: 1, count: 1, total: deptData.length };

  const itemsGenerator = (_row: Record<string, unknown>) => [
    [{ label: "Update Time", icon: "i-heroicons-clock", click: () => setShowUpdateTime(true) }],
  ];

  const handleCreateDepartment = async () => {
    if (!deptName.trim()) { toast("Department name is required", "error"); return; }
    setLoading(true);
    try {
      if (organizationId) {
        await createDeptOrg({ organizationId, name: deptName });
      } else if (employerId) {
        await createDeptLegacy({ employerId, name: deptName });
      } else {
        toast("No organization found", "error");
        return;
      }
      toast("Department Successfully Created!", "success");
      setIsModalOpen(false);
      setDeptName("");
    } catch {
      toast("Failed to create department", "error");
    } finally {
      setLoading(false);
    }
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
      toast("Login time Successfully Updated!", "success");
    } catch {
      toast("Failed to update time", "error");
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col mb-4 md:mb-0">
          <span className="text-xl md:text-2xl font-bold">User Management</span>
          {myAdminOrg && (
            <span className="text-sm text-purple-700 font-medium">{myAdminOrg.name}</span>
          )}
          <span className="text-sm font-light text-gray-600">
            Manage your company&apos;s users &amp; departments
          </span>
        </div>
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
          <Button onClick={() => setShowUpdateTime(!showUpdateTime)} color="primary" size="lg">
            Update Time
          </Button>
          <Button color="primary" size="lg" onClick={() => setIsModalOpen(true)}>
            Create Department
          </Button>
        </div>
      </div>

      {showUpdateTime && (
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-4">
          <XDropdown
            placeholder="Select Time"
            items={morningTimes}
            onSelect={(val) => setSignInTime(String(val.value ?? ""))}
          />
          <Button color="primary" size="lg" onClick={handleSaveTime}>Save</Button>
        </div>
      )}

      <div className="mt-8 md:mt-20">
        {departments === null ? (
          <p className="text-gray-400 text-sm text-center py-12">Loading departments…</p>
        ) : departments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-12">
            No departments yet.{" "}
            <button onClick={() => setIsModalOpen(true)} className="text-purple-600 hover:underline">
              Create the first one.
            </button>
          </p>
        ) : (
          <XTable
            columns={columns}
            itemsGenerator={itemsGenerator}
            tableData={deptData}
            paginationData={paginationData}
          />
        )}
      </div>

      <XModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Department"
        footer={
          <div className="flex justify-end">
            <Button size="lg" color="primary" loading={loading} onClick={handleCreateDepartment}>
              Submit
            </Button>
          </div>
        }
      >
        <div className="space-y-5 w-full">
          <FormField label="Department Name" name="deptName">
            <Input
              placeholder="Enter department name"
              size="lg"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
            />
          </FormField>
        </div>
      </XModal>
    </main>
  );
}
