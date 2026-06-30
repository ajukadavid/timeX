"use client";

import { useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrgDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.orgId as Id<"organizations">;
  const { isAuthenticated } = useConvexAuth();

  const org = useQuery(
    api.organizations.getOrg,
    isAuthenticated ? { organizationId: orgId } : "skip"
  );
  const members = useQuery(
    api.organizations.listOrgMembers,
    isAuthenticated ? { organizationId: orgId } : "skip"
  );

  const today = new Date().toISOString().slice(0, 10);
  const dailySummary = useQuery(
    api.attendance.getOrgDailySummary,
    isAuthenticated ? { organizationId: orgId, date: today } : "skip"
  );

  const setOrgMemberRole = useMutation(api.organizations.setOrgMemberRole);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSetRole(
    userId: Id<"users">,
    newRole: "admin" | "staff"
  ) {
    setLoadingUserId(userId);
    setError(null);
    try {
      await setOrgMemberRole({ organizationId: orgId, userId, orgRole: newRole });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setLoadingUserId(null);
    }
  }

  if (org === undefined || members === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    );
  }

  if (org === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Organization not found.</p>
      </div>
    );
  }

  const onTime = dailySummary?.onTime ?? 0;
  const late = dailySummary?.late ?? 0;
  const total = dailySummary?.totalEntries ?? 0;

  const adminMembers = (members ?? []).filter((m) => m.orgRole === "admin");
  const staffMembers = (members ?? []).filter((m) => m.orgRole === "staff");

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/superAdmin")}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        All organizations
      </button>

      {/* Org header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{org.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Timezone: {org.timezone}
              {org.defaultSignInTime && (
                <> &middot; Default sign-in: {org.defaultSignInTime}</>
              )}
            </p>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              org.isActive
                ? "bg-green-900/40 text-green-400"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            {org.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Today's attendance stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-xs text-gray-500 mt-1">Signed in today</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{onTime}</p>
          <p className="text-xs text-gray-500 mt-1">On time</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{late}</p>
          <p className="text-xs text-gray-500 mt-1">Late</p>
        </div>
      </div>

      {/* Admins section */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Organization Admins ({adminMembers.length})
          </h2>
          <span className="text-xs text-gray-500">
            Admins manage staff and attendance
          </span>
        </div>

        {adminMembers.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No admins yet — promote a staff member below.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {adminMembers.map((m) => (
              <MemberRow
                key={m.userId}
                member={m}
                isLoading={loadingUserId === m.userId}
                onSetRole={handleSetRole}
              />
            ))}
          </div>
        )}
      </div>

      {/* Staff section */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white">
            Staff ({staffMembers.length})
          </h2>
        </div>

        {staffMembers.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No staff in this organization yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {staffMembers.map((m) => (
              <MemberRow
                key={m.userId}
                member={m}
                isLoading={loadingUserId === m.userId}
                onSetRole={handleSetRole}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Member row ───────────────────────────────────────────────

type Member = {
  userId: Id<"users">;
  profileId: Id<"staffProfiles">;
  email: string;
  firstName: string;
  lastName: string;
  orgRole: "admin" | "staff";
  jobTitle: string;
  employmentStatus: string;
  needsInvite: boolean;
};

function MemberRow({
  member: m,
  isLoading,
  onSetRole,
}: {
  member: Member;
  isLoading: boolean;
  onSetRole: (userId: Id<"users">, role: "admin" | "staff") => void;
}) {
  return (
    <div className="px-6 py-4 flex items-center gap-4">
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
          m.orgRole === "admin"
            ? "bg-indigo-900/60 text-indigo-300"
            : "bg-gray-800 text-gray-400"
        }`}
      >
        {(m.firstName?.[0] ?? m.email[0] ?? "?").toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {m.firstName} {m.lastName}
          {m.needsInvite && (
            <span className="ml-2 text-xs text-amber-400 font-normal">
              invite pending
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500 truncate">{m.email}</p>
      </div>

      {/* Job title */}
      <p className="text-xs text-gray-500 hidden md:block min-w-[100px] text-right">
        {m.jobTitle}
      </p>

      {/* Role badge */}
      <span
        className={`text-xs px-2.5 py-1 rounded-full font-medium min-w-[56px] text-center ${
          m.orgRole === "admin"
            ? "bg-indigo-900/40 text-indigo-300"
            : "bg-gray-800 text-gray-400"
        }`}
      >
        {m.orgRole}
      </span>

      {/* Action button */}
      <button
        disabled={isLoading}
        onClick={() =>
          onSetRole(m.userId, m.orgRole === "admin" ? "staff" : "admin")
        }
        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
          m.orgRole === "admin"
            ? "border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600"
            : "border-indigo-800 text-indigo-400 hover:text-indigo-300 hover:border-indigo-600"
        }`}
      >
        {isLoading
          ? "…"
          : m.orgRole === "admin"
          ? "Demote to Staff"
          : "Set as Admin"}
      </button>
    </div>
  );
}
