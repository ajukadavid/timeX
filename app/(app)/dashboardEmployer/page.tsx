"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction, useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { XSummary } from "@/components/XSummary";
import { XTable } from "@/components/XTable";
import { XModal } from "@/components/XModal";
import { XDropdown } from "@/components/XDropdown";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { toast } from "@/lib/toast";

const columns = [
  { key: "firstName", label: "First Name", id: "firstName" },
  { key: "lastName", label: "Last Name", id: "lastName" },
  { key: "role", label: "Staff Role", id: "role" },
  { key: "email", label: "Email", id: "email" },
  { key: "lastEntryTime", label: "Last login time", id: "lastEntryTime" },
  { key: "actions", label: "Actions", id: "actions" },
];

// ─── Inner component that uses useSearchParams ─────────────────

function DashboardEmployerInner() {
  const router = useRouter();
  const params = useSearchParams();
  const orgIdParam = params.get("org") as Id<"organizations"> | null;
  const { isAuthenticated } = useConvexAuth();

  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const myAdminOrg = useQuery(
    api.organizations.getMyAdminOrg,
    isAuthenticated ? {} : "skip"
  );

  // Resolve which orgId to use: URL param > user's own admin org
  const organizationId = orgIdParam ?? myAdminOrg?._id ?? null;

  // Access control: allow admin role OR super admin; block pure staff
  const isAllowed =
    me?.platformRole === "superAdmin" ||
    me?.role === "admin";

  useEffect(() => {
    if (me === undefined || myAdminOrg === undefined) return;
    if (me === null) {
      router.replace("/login");
      return;
    }
    if (!isAllowed) {
      router.replace(`/dashboardStaff/${me._id}`);
    }
  }, [me, myAdminOrg, isAllowed, router]);

  // ── Legacy employer ID (backward compat) ──
  const employerId = me?._id as Id<"users"> | undefined;

  // ── Queries: org model preferred, legacy fallback ──
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
    isAuthenticated && !organizationId && employerId
      ? { employerId, date: today }
      : "skip"
  );
  const dailySummary = dailySummaryOrg ?? dailySummaryLegacy ?? null;

  // ── Mutations ──
  const createStaffOrg = useMutation(api.staff.createStaffInOrg);
  const createStaffLegacy = useMutation(api.staff.createStaffFromDashboard);
  const deleteStaffMutation = useMutation(api.staff.removeStaffByUserId);
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

  const staffData = (staffList ?? []).map((x) => {
    const date = x.lastEntryTime ? new Date(x.lastEntryTime) : null;
    return {
      ...x,
      _id: x.userId,
      lastEntryTime: date
        ? date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        : "N/A",
    };
  });

  const departmentItems = (departments ?? []).map((d) => ({
    name: d.name,
    id: d._id,
  }));

  const itemsGenerator = (row: Record<string, unknown>) => [
    [
      {
        label: "View Employee",
        icon: "i-heroicons-eye-20-solid",
        click: () => router.push(`/dashboardStaff/${row._id}`),
      },
    ],
    [
      {
        label: "Delete Employee",
        icon: "i-heroicons-trash-20-solid",
        click: () => {
          setSelectedForDelete(row as never);
          setShowDeleteModal(true);
        },
      },
    ],
  ];

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
          departmentId: (form.department || undefined) as
            | Id<"departments">
            | undefined,
        });
      } else {
        await createStaffLegacy({
          employerId: employerId!,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          role: form.role,
          departmentId: (form.department || undefined) as
            | Id<"departments">
            | undefined,
        });
      }

      try {
        const invite = await inviteByEmail({
          email: form.email.trim(),
          organizationId: organizationId ?? undefined,
        });
        if (invite.success) {
          toast(`Employee created and invitation sent to ${form.email}`, "success");
        } else {
          toast(`Employee created, but invite failed: ${invite.message}`, "error");
        }
      } catch {
        toast(
          "Employee created, but invite email failed — use Send Invite to retry",
          "error"
        );
      }

      setShowAddModal(false);
      setForm({ firstName: "", lastName: "", email: "", role: "", department: "" });
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Failed to create employee",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedForDelete) return;
    setLoading(true);
    try {
      await deleteStaffMutation({
        userId: selectedForDelete._id as Id<"users">,
      });
      toast("Employee successfully deleted", "success");
    } catch {
      toast("Error deleting employee", "error");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedForDelete(null);
    }
  };

  const pendingInviteCount = (staffList ?? []).filter((s) => s.needsInvite)
    .length;

  const handleInviteOne = async () => {
    if (!inviteEmail.trim()) {
      toast("Enter an email address", "error");
      return;
    }
    setLoading(true);
    try {
      const result = await inviteByEmail({
        email: inviteEmail.trim(),
        organizationId: organizationId ?? undefined,
      });
      if (result.success) {
        toast(`Invitation sent to ${result.email}`, "success");
        setInviteEmail("");
      } else {
        toast(result.message, "error");
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to send invite", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteAll = async () => {
    setLoading(true);
    try {
      const result = await invitePending({
        organizationId: organizationId ?? undefined,
      });
      if (result.invited > 0) {
        toast(
          `Sent ${result.invited} invitation${result.invited !== 1 ? "s" : ""}`,
          "success"
        );
      }
      if (result.failed > 0) {
        toast(
          `${result.failed} invite${result.failed !== 1 ? "s" : ""} failed`,
          "error"
        );
      }
      if (result.invited === 0 && result.failed === 0) {
        toast("No pending staff to invite", "error");
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to send invites", "error");
    } finally {
      setLoading(false);
    }
  };

  const paginationData = { page: 1, count: 1, total: staffData.length };

  if (me === undefined || myAdminOrg === undefined) {
    return (
      <main className="min-h-full bg-white p-4 md:p-10 flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-white p-4 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col mb-4 md:mb-0">
          <span className="text-xl md:text-2xl font-bold">Welcome Admin</span>
          {myAdminOrg && (
            <span className="text-sm text-purple-700 font-medium">
              {myAdminOrg.name}
            </span>
          )}
          <span className="text-sm font-light">
            See Today&apos;s attendance overview..
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="border-[#762CC0] cursor-pointer border py-3 px-5 space-x-2 rounded-md flex justify-center items-center gap-2 hover:bg-purple-50 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.922 3.29004C14.6963 1.66245 17.0834 0.848663 18.3674 2.13261C19.6513 3.41656 18.8375 5.80371 17.21 10.578L16.1016 13.8292C14.8517 17.4958 14.2267 19.3291 13.1964 19.4808C12.9195 19.5216 12.6328 19.4971 12.3587 19.4091C11.3395 19.0819 10.8007 17.1489 9.7231 13.283C9.4841 12.4255 9.3646 11.9967 9.0924 11.6692C9.0134 11.5742 8.9258 11.4866 8.8308 11.4076C8.5033 11.1354 8.0745 11.0159 7.21705 10.7769C3.35111 9.6993 1.41814 9.1605 1.0909 8.14127C1.00292 7.86724 0.97837 7.58053 1.01916 7.30355C1.17088 6.27332 3.00419 5.64834 6.6708 4.39838L9.922 3.29004Z"
                stroke="#1A1A1A"
                strokeWidth="2"
              />
            </svg>
            <span>
              Send Invite{pendingInviteCount > 0 ? ` (${pendingInviteCount})` : ""}
            </span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#762CC0] text-white border py-3 px-5 space-x-2 rounded-md flex justify-center items-center gap-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 22.5H6.59087C5.04549 22.5 3.81631 21.748 2.71266 20.6966C0.453366 18.5441 4.1628 16.824 5.57757 15.9816C7.97679 14.553 10.8425 14.1575 13.5 14.7952"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 7C16.5 9.48528 14.4853 11.5 12 11.5C9.51472 11.5 7.5 9.48528 7.5 7C7.5 4.51472 9.51472 2.5 12 2.5C14.4853 2.5 16.5 4.51472 16.5 7Z"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M19 23.7426V19.5M19 19.5V15.2574M19 19.5H14.7574M19 19.5H23.2427"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Add employee</span>
          </button>
        </div>
      </div>

      <div className="mt-8 md:mt-20">
        <XSummary
          totalEmployees={staffData.length}
          presentToday={dailySummary?.uniqueStaffSignedIn ?? 0}
          lateToday={dailySummary?.late ?? 0}
          absentToday={Math.max(
            0,
            staffData.length - (dailySummary?.uniqueStaffSignedIn ?? 0)
          )}
        />
        <XTable
          columns={columns}
          tableData={staffData}
          paginationData={paginationData}
          itemsGenerator={itemsGenerator}
        />
      </div>

      {/* Add Employee Modal */}
      <XModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setForm({ firstName: "", lastName: "", email: "", role: "", department: "" });
        }}
        title="Create Employee"
        size="2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              color="gray"
              variant="soft"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button loading={loading} onClick={handleCreate}>
              Create Employee
            </Button>
          </div>
        }
      >
        <div className="space-y-5 w-full">
          <FormField label="First Name" name="firstName">
            <Input
              placeholder="First Name"
              size="lg"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </FormField>
          <FormField label="Last Name" name="lastName">
            <Input
              placeholder="Last Name"
              size="lg"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </FormField>
          <FormField label="Email" name="email">
            <Input
              type="email"
              placeholder="Email Address"
              size="lg"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FormField>
          <FormField label="Role / Job Title" name="role">
            <Input
              placeholder="e.g. Software Engineer"
              size="lg"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </FormField>
          <FormField label="Department" name="department">
            <XDropdown
              items={departmentItems}
              onSelect={(val) =>
                setForm({ ...form, department: String(val.id ?? "") })
              }
            />
          </FormField>
        </div>
      </XModal>

      {/* Invite Modal */}
      <XModal
        open={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteEmail("");
        }}
        title="Send Staff Invites"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              color="gray"
              variant="soft"
              onClick={() => setShowInviteModal(false)}
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <p className="text-gray-600 text-sm">
            Invite staff to create their Clerk account. They will receive an
            email to set their password.
          </p>
          <FormField label="Email" name="inviteEmail">
            <Input
              type="email"
              placeholder="staff@company.com"
              size="lg"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </FormField>
          <Button loading={loading} onClick={handleInviteOne} className="w-full">
            Send Invitation
          </Button>
          {pendingInviteCount > 0 && (
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-3">
                {pendingInviteCount} staff member
                {pendingInviteCount !== 1 ? "s" : ""} haven&apos;t been invited
                yet.
              </p>
              <Button
                loading={loading}
                variant="outline"
                onClick={handleInviteAll}
                className="w-full"
              >
                Invite All Pending Staff
              </Button>
            </div>
          )}
        </div>
      </XModal>

      {/* Delete Confirmation Modal */}
      <XModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Employee"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              color="gray"
              variant="soft"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button color="red" loading={loading} onClick={handleDelete}>
              Delete Employee
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <strong>
              {selectedForDelete?.firstName} {selectedForDelete?.lastName}
            </strong>
            ? This action cannot be undone.
          </p>
        </div>
      </XModal>
    </main>
  );
}

// ─── Exported page with Suspense boundary for useSearchParams ─

export default function DashboardEmployerPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-full bg-white p-4 md:p-10 flex items-center justify-center">
          <p className="text-gray-400">Loading…</p>
        </main>
      }
    >
      <DashboardEmployerInner />
    </Suspense>
  );
}
