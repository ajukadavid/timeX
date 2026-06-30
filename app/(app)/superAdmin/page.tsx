"use client";

import { useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

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

  const inputStyle = {
    width: "100%",
    backgroundColor: "#f6faf7",
    border: "1px solid rgba(191,201,195,0.5)",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    color: "#181d1b",
    outline: "none",
    fontFamily: "var(--font-hanken, sans-serif)",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "#707974",
    fontFamily: "var(--font-jetbrains, monospace)",
    marginBottom: "0.375rem",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,53,39,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-2xl border p-6" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)", boxShadow: "0 20px 60px rgba(0,53,39,0.2)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
            Create Organization
          </h2>
          <button onClick={onClose} style={{ color: "#707974" }}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={labelStyle}>Company name</label>
            <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Corp" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Admin first name</label>
              <input style={inputStyle} value={form.adminFirstName} onChange={(e) => setForm({ ...form, adminFirstName: e.target.value })} placeholder="Jane" required />
            </div>
            <div>
              <label style={labelStyle}>Admin last name</label>
              <input style={inputStyle} value={form.adminLastName} onChange={(e) => setForm({ ...form, adminLastName: e.target.value })} placeholder="Doe" required />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Admin email</label>
            <input style={inputStyle} type="email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} placeholder="admin@acme.com" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Timezone</label>
              <input style={inputStyle} value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} placeholder="Africa/Lagos" />
            </div>
            <div>
              <label style={labelStyle}>Default sign-in</label>
              <input style={{ ...inputStyle, fontFamily: "var(--font-jetbrains, monospace)" }} type="time" value={form.defaultSignInTime} onChange={(e) => setForm({ ...form, defaultSignInTime: e.target.value })} />
            </div>
          </div>

          {error && (
            <div className="rounded-lg px-3 py-2 text-sm flex items-center gap-2" style={{ backgroundColor: "#ffdad6", color: "#93000a" }}>
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border text-sm transition-all"
              style={{ borderColor: "rgba(191,201,195,0.5)", color: "#707974" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50 transition-all"
              style={{ backgroundColor: "#003527", color: "#ffffff" }}
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
  const stats = useQuery(api.organizations.getPlatformStats, isAuthenticated ? {} : "skip");
  const orgs = useQuery(api.organizations.listAll, isAuthenticated ? {} : "skip");
  const toggleActive = useMutation(api.organizations.toggleOrgActive);
  const [showCreate, setShowCreate] = useState(false);

  async function handleToggle(orgId: Id<"organizations">, current: boolean) {
    await toggleActive({ organizationId: orgId, isActive: !current });
  }

  const statCards = [
    { label: "Total Orgs", value: stats?.totalOrgs ?? "—", icon: "corporate_fare", iconBg: "#b0f0d6", iconColor: "#003527" },
    { label: "Active Orgs", value: stats?.activeOrgs ?? "—", icon: "check_circle", iconBg: "#bbf37c", iconColor: "#1c3400" },
    { label: "Total Staff", value: stats?.totalStaff ?? "—", icon: "groups", iconBg: "#ffdbd0", iconColor: "#832600" },
    { label: "Platform Users", value: stats?.totalUsers ?? "—", icon: "person", iconBg: "#ebefec", iconColor: "#404944" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
            Platform Overview
          </h1>
          <p className="text-sm mt-1" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
            Manage all organizations on Logasiko
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{ backgroundColor: "#003527", color: "#ffffff" }}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Organization
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon, iconBg, iconColor }) => (
          <div key={label} className="flex items-center gap-4 p-5 rounded-xl border" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)", boxShadow: "0 2px 8px rgba(6,78,59,0.04)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: iconColor, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{label}</p>
              <p className="text-2xl font-bold mt-0.5" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Organizations table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "#f6faf7" }}>
          <h2 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Organizations</h2>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: "#ebefec", color: "#707974" }}>
            {orgs?.length ?? 0}
          </span>
        </div>

        {!orgs ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[36px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
            <p className="text-sm" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Loading organizations…</p>
          </div>
        ) : orgs.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[48px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
            <p className="font-semibold" style={{ color: "#003527" }}>No organizations yet.</p>
            <button onClick={() => setShowCreate(true)} className="text-sm font-bold" style={{ color: "#ac3400" }}>
              Create the first one →
            </button>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(191,201,195,0.15)" }}>
            {orgs.map(({ org, staffCount, adminEmail, adminName }) => {
              const initials = (adminName ?? adminEmail ?? "?")
                .split(" ").map((w: string) => w[0] ?? "").slice(0, 2).join("").toUpperCase() || "?";
              return (
                <div
                  key={org._id}
                  className="px-6 py-4 flex items-center gap-4 transition-colors"
                  style={{ borderBottom: "1px solid rgba(191,201,195,0.15)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(241,245,242,0.5)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: org.isActive ? "#064e3b" : "#ebefec", color: org.isActive ? "#b0f0d6" : "#707974" }}
                  >
                    {initials}
                  </div>

                  {/* Org info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "#181d1b" }}>{org.name}</p>
                    <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                      {adminName ? `${adminName} · ` : ""}{adminEmail ?? "—"}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex flex-col items-end gap-0.5 min-w-[80px]">
                    <span className="text-sm font-bold" style={{ color: "#003527" }}>{staffCount} staff</span>
                    <span className="text-xs font-mono" style={{ color: "#707974" }}>{org.timezone}</span>
                  </div>

                  {/* Status badge */}
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-mono" style={
                    org.isActive
                      ? { backgroundColor: "#b0f0d6", color: "#0b513d" }
                      : { backgroundColor: "#ebefec", color: "#707974" }
                  }>
                    {org.isActive ? "Active" : "Inactive"}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/superAdmin/orgs/${org._id}`)}
                      className="text-xs px-3 py-1.5 rounded-lg border transition-all font-bold"
                      style={{ borderColor: "rgba(0,53,39,0.3)", color: "#003527" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleToggle(org._id, org.isActive)}
                      className="text-xs px-3 py-1.5 rounded-lg border transition-all"
                      style={{ borderColor: "rgba(191,201,195,0.5)", color: "#707974" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; (e.currentTarget as HTMLButtonElement).style.color = "#181d1b"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#707974"; }}
                    >
                      {org.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && <CreateOrgModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
