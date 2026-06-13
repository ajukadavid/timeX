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

  useEffect(() => {
    if (me === undefined) return;
    if (me === null || me.role !== "admin") {
      router.replace(me ? `/dashboardStaff/${me._id}` : "/login");
    }
  }, [me, router]);

  const employerId = me?._id as Id<"users"> | undefined;

  const departments = useQuery(
    api.departments.listByEmployer,
    employerId ? { employerId } : "skip"
  );

  const createDept = useMutation(api.departments.createDepartment);
  const updateTime = useMutation(api.settings.updateDefaultSignInTime);

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
    if (!employerId) return;
    setLoading(true);
    try {
      await createDept({ employerId, name: deptName });
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
    if (!employerId) return;
    try {
      await updateTime({ employerId, defaultSignInTime: signInTime });
      setShowUpdateTime(false);
      toast("Login time Successfully Updated!", "success");
    } catch {
      toast("Failed to update time", "error");
    }
  };

  return (
    <main className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col mb-4 md:mb-0">
          <span className="text-xl md:text-2xl font-bold">User Management</span>
          <span className="text-sm font-light text-gray-600">Manage your company&apos;s users &amp; departments</span>
        </div>
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
          <Button onClick={() => setShowUpdateTime(!showUpdateTime)} color="primary" size="lg">Update Time</Button>
          <Button color="primary" size="lg" onClick={() => setIsModalOpen(true)}>Create Department</Button>
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
        <XTable columns={columns} itemsGenerator={itemsGenerator} tableData={deptData} paginationData={paginationData} />
      </div>

      <XModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Department"
        footer={
          <div className="flex justify-end">
            <Button size="lg" color="primary" loading={loading} onClick={handleCreateDepartment}>Submit</Button>
          </div>
        }
      >
        <div className="space-y-5 w-full">
          <FormField label="Department Name" name="deptName">
            <Input placeholder="Please Enter name of department" size="lg" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
          </FormField>
        </div>
      </XModal>
    </main>
  );
}
