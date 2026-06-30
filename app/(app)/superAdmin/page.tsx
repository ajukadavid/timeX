"use client";

import { useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// ─── Stats cards ─────────────────────────────────────────────

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

// ─── Create org modal ─────────────────────────────────────────

function CreateOrgModal({ onClose }: { onClose: () => void }) {
  const createOrg = useMutation(api.organizations.createOrg);
  const [form, setForm] = useState({
    name: "",
    timezone: "Africa/Lagos",
    adminEmail: "",
    adminFirstName: "",
    adminLastName: "",
    defaultSignInTime: "09:00",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createOrg(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create org");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-white mb-5">
          Create Organization
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Company name
            </label>
            <input
              className={input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Acme Corp"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Admin first name
              </label>
              <input
                className={input}
                value={form.adminFirstName}
                onChange={(e) =>
                  setForm({ ...form, adminFirstName: e.target.value })
                }
                placeholder="Jane"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Admin last name
              </label>
              <input
                className={input}
                value={form.adminLastName}
                onChange={(e) =>
                  setForm({ ...form, adminLastName: e.target.value })
                }
                placeholder="Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Admin email
            </label>
            <input
              className={input}
              type="email"
              value={form.adminEmail}
              onChange={(e) =>
                setForm({ ...form, adminEmail: e.target.value })
              }
              placeholder="admin@acme.com"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Timezone
              </label>
              <input
                className={input}
                value={form.timezone}
                onChange={(e) =>
                  setForm({ ...form, timezone: e.target.value })
                }
                placeholder="Africa/Lagos"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Default sign-in time
              </label>
              <input
                className={input}
                type="time"
                value={form.defaultSignInTime}
                onChange={(e) =>
                  setForm({ ...form, defaultSignInTime: e.target.value })
                }
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────

export default function SuperAdminPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const stats = useQuery(
    api.organizations.getPlatformStats,
    isAuthenticated ? {} : "skip"
  );
  const orgs = useQuery(
    api.organizations.listAll,
    isAuthenticated ? {} : "skip"
  );
  const toggleActive = useMutation(api.organizations.toggleOrgActive);
  const [showCreate, setShowCreate] = useState(false);

  async function handleToggle(
    orgId: Id<"organizations">,
    current: boolean
  ) {
    await toggleActive({ organizationId: orgId, isActive: !current });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all organizations on TimeX
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Organization
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Orgs" value={stats?.totalOrgs ?? "—"} />
        <StatCard label="Active Orgs" value={stats?.activeOrgs ?? "—"} />
        <StatCard label="Total Staff" value={stats?.totalStaff ?? "—"} />
        <StatCard label="Platform Users" value={stats?.totalUsers ?? "—"} />
      </div>

      {/* Organizations table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white">Organizations</h2>
        </div>

        {!orgs ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Loading organizations…
          </div>
        ) : orgs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No organizations yet.{" "}
            <button
              onClick={() => setShowCreate(true)}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Create the first one.
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {orgs.map(({ org, staffCount, adminEmail, adminName }) => (
              <div
                key={org._id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors"
              >
                {/* Left: org info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {org.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Admin:{" "}
                    <span className="text-gray-400">
                      {adminName ? `${adminName} · ` : ""}
                      {adminEmail ?? "—"}
                    </span>
                  </p>
                </div>

                {/* Middle: staff count + timezone */}
                <div className="hidden md:flex flex-col items-end gap-0.5 min-w-[80px]">
                  <span className="text-sm text-white font-medium">
                    {staffCount} staff
                  </span>
                  <span className="text-xs text-gray-500">{org.timezone}</span>
                </div>

                {/* Status badge */}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    org.isActive
                      ? "bg-green-900/40 text-green-400"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {org.isActive ? "Active" : "Inactive"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      router.push(`/superAdmin/orgs/${org._id}`)
                    }
                    className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-800 hover:border-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleToggle(org._id, org.isActive)}
                    className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {org.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && <CreateOrgModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
