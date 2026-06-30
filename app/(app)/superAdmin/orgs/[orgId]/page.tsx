"use client";

import { useState, useEffect } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

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

function MemberRow({ member: m, isLoading, onSetRole }: { member: Member; isLoading: boolean; onSetRole: (userId: Id<"users">, role: "admin" | "staff") => void; }) {
  const fullName = `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || m.email;
  const initials = ((m.firstName?.[0] ?? "") + (m.lastName?.[0] ?? "")).toUpperCase() || (m.email[0]?.toUpperCase() ?? "?");
  const isAdmin = m.orgRole === "admin";

  return (
    <div
      className="px-6 py-4 flex items-center gap-4 transition-colors"
      style={{ borderBottom: "1px solid rgba(191,201,195,0.15)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(241,245,242,0.5)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={isAdmin ? { backgroundColor: "#064e3b", color: "#b0f0d6" } : { backgroundColor: "#ebefec", color: "#707974" }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate" style={{ color: "#181d1b" }}>{fullName}</p>
          {m.needsInvite && (
            <span className="text-xs px-2 py-0.5 rounded-full font-mono shrink-0" style={{ backgroundColor: "#ffdbd0", color: "#832600" }}>
              invite pending
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{m.email}</p>
      </div>

      {/* Job title */}
      {m.jobTitle && (
        <p className="text-xs hidden md:block" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974", minWidth: "100px", textAlign: "right" }}>
          {m.jobTitle}
        </p>
      )}

      {/* Role badge */}
      <span
        className="text-xs px-2.5 py-0.5 rounded-full font-mono min-w-[52px] text-center"
        style={isAdmin ? { backgroundColor: "#064e3b", color: "#80bea6" } : { backgroundColor: "#ebefec", color: "#404944" }}
      >
        {m.orgRole}
      </span>

      {/* Action */}
      <button
        disabled={isLoading}
        onClick={() => onSetRole(m.userId, isAdmin ? "staff" : "admin")}
        className="text-xs px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 font-bold"
        style={isAdmin
          ? { borderColor: "rgba(191,201,195,0.5)", color: "#707974" }
          : { borderColor: "rgba(0,53,39,0.3)", color: "#003527" }
        }
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ebefec"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
      >
        {isLoading ? "…" : isAdmin ? "Demote to Staff" : "Set as Admin"}
      </button>
    </div>
  );
}

export default function OrgDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.orgId as Id<"organizations">;
  const { isAuthenticated } = useConvexAuth();

  const org = useQuery(api.organizations.getOrg, isAuthenticated ? { organizationId: orgId } : "skip");
  const members = useQuery(api.organizations.listOrgMembers, isAuthenticated ? { organizationId: orgId } : "skip");

  const today = new Date().toISOString().slice(0, 10);
  const dailySummary = useQuery(api.attendance.getOrgDailySummary, isAuthenticated ? { organizationId: orgId, date: today } : "skip");

  const setOrgMemberRole = useMutation(api.organizations.setOrgMemberRole);
  const setOrgSubscriptionTier = useMutation(api.organizations.setOrgSubscriptionTier);
  const setOrgFeatureEntitlements = useMutation(api.organizations.setOrgFeatureEntitlements);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [savingPremium, setSavingPremium] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entitlements, setEntitlements] = useState({
    geoFence: false,
    biometric: false,
    offlineSync: false,
  });

  useEffect(() => {
    if (!org) return;
    setEntitlements({
      geoFence: org.featuresGeoFenceAllowed ?? false,
      biometric: org.featuresBiometricAllowed ?? false,
      offlineSync: org.featuresOfflineSyncAllowed ?? false,
    });
  }, [org]);

  async function handleSetSubscriptionTier(tier: "free" | "paid") {
    setSavingPremium(true);
    setError(null);
    try {
      await setOrgSubscriptionTier({ organizationId: orgId, subscriptionTier: tier });
      if (tier === "free") {
        setEntitlements({ geoFence: false, biometric: false, offlineSync: false });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subscription");
    } finally {
      setSavingPremium(false);
    }
  }

  async function handleSaveEntitlements() {
    setSavingPremium(true);
    setError(null);
    try {
      await setOrgFeatureEntitlements({
        organizationId: orgId,
        featuresGeoFenceAllowed: entitlements.geoFence,
        featuresBiometricAllowed: entitlements.biometric,
        featuresOfflineSyncAllowed: entitlements.offlineSync,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update entitlements");
    } finally {
      setSavingPremium(false);
    }
  }

  async function handleSetRole(userId: Id<"users">, newRole: "admin" | "staff") {
    setLoadingUserId(userId);
    setError(null);
    try {
      await setOrgMemberRole({ organizationId: orgId, userId, orgRole: newRole });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setLoadingUserId(null); }
  }

  if (org === undefined || members === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[40px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
          <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "12px", color: "#707974" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (org === null) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-2">
          <span className="material-symbols-outlined text-[48px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
          <p style={{ color: "#707974" }}>Organization not found.</p>
        </div>
      </div>
    );
  }

  const onTime = dailySummary?.onTime ?? 0;
  const late = dailySummary?.late ?? 0;
  const total = dailySummary?.totalEntries ?? 0;
  const absent = (members?.length ?? 0) - total;

  const adminMembers = (members ?? []).filter((m) => m.orgRole === "admin");
  const staffMembers = (members ?? []).filter((m) => m.orgRole === "staff");
  const subscriptionTier = org.subscriptionTier ?? "free";
  const isPaid = subscriptionTier === "paid";

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/superAdmin")}
        className="flex items-center gap-1.5 text-sm transition-all"
        style={{ color: "#707974" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#003527"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#707974"; }}
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        All organizations
      </button>

      {/* Org header */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)", boxShadow: "0 2px 10px rgba(6,78,59,0.04)" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#064e3b" }}
            >
              <span className="material-symbols-outlined text-[28px]" style={{ color: "#b0f0d6", fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>{org.name}</h1>
              <p className="text-sm mt-1" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                {org.timezone}
                {org.defaultSignInTime && <> · Sign-in: <span style={{ color: "#003527", fontWeight: "bold" }}>{org.defaultSignInTime}</span></>}
              </p>
            </div>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-mono shrink-0"
            style={org.isActive ? { backgroundColor: "#b0f0d6", color: "#0b513d" } : { backgroundColor: "#ebefec", color: "#707974" }}
          >
            {org.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-2 text-sm" style={{ backgroundColor: "#ffdad6", color: "#93000a" }}>
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </div>
      )}

      {/* Premium access (super admin) */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[22px]" style={{ color: "#ac3400" }}>workspace_premium</span>
          <h2 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Premium Access</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: "#f1f5f2" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#003527" }}>Subscription tier</p>
            <p className="text-xs mt-1" style={{ color: "#707974" }}>
              Only paid organisations can be granted premium features. When you add billing, this will sync automatically.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {(["free", "paid"] as const).map((tier) => (
              <button
                key={tier}
                disabled={savingPremium}
                onClick={() => handleSetSubscriptionTier(tier)}
                className="px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all disabled:opacity-50"
                style={
                  subscriptionTier === tier
                    ? { backgroundColor: "#003527", color: "#ffffff" }
                    : { backgroundColor: "#ffffff", color: "#003527", border: "1px solid rgba(191,201,195,0.5)" }
                }
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
          Feature entitlements {isPaid ? "(org admins can toggle these on)" : "(requires paid tier)"}
        </p>

        <div className={`space-y-3 ${!isPaid ? "opacity-50 pointer-events-none" : ""}`}>
          {[
            { key: "geoFence" as const, icon: "location_on", label: "Geo-fenced Zones", desc: "Allow org to restrict clock-ins to a GPS zone" },
            { key: "biometric" as const, icon: "fingerprint", label: "Biometric Auth", desc: "Allow org to require Face ID / Touch ID" },
            { key: "offlineSync" as const, icon: "cloud_off", label: "Offline Syncing", desc: "Allow org to queue clock-ins offline" },
          ].map(({ key, icon, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: "rgba(191,201,195,0.3)" }}>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] mt-0.5" style={{ color: "#003527" }}>{icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#003527" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#707974" }}>{desc}</p>
                </div>
              </div>
              <div
                className="w-10 h-6 rounded-full transition-colors cursor-pointer shrink-0"
                style={{ backgroundColor: entitlements[key] ? "#003527" : "#dfe3e1" }}
                onClick={() => setEntitlements((e) => ({ ...e, [key]: !e[key] }))}
              >
                <div className="w-4 h-4 bg-white rounded-full mt-1 transition-transform shadow-sm" style={{ transform: entitlements[key] ? "translateX(20px)" : "translateX(4px)" }} />
              </div>
            </div>
          ))}
        </div>

        {!isPaid && (
          <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: "#832600" }}>
            <span className="material-symbols-outlined text-[14px]">info</span>
            Set this organisation to Paid before enabling premium features.
          </p>
        )}

        <button
          onClick={handleSaveEntitlements}
          disabled={savingPremium || !isPaid}
          className="mt-4 w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50"
          style={{ backgroundColor: "#ac3400", color: "#ffffff" }}
        >
          {savingPremium ? "Saving…" : "Save Entitlements"}
        </button>
      </div>

      {/* Today's attendance stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Signed in today", value: total, iconBg: "#b0f0d6", iconColor: "#003527", icon: "login" },
          { label: "On time", value: onTime, iconBg: "#bbf37c", iconColor: "#1c3400", icon: "check_circle" },
          { label: "Late", value: late, iconBg: "#ffdbd0", iconColor: "#832600", icon: "alarm_on" },
          { label: "Members", value: members?.length ?? 0, iconBg: "#ebefec", iconColor: "#404944", icon: "groups" },
        ].map(({ label, value, iconBg, iconColor, icon }) => (
          <div key={label} className="rounded-xl border p-5 flex items-center gap-3" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: iconColor, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{label}</p>
              <p className="text-2xl font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Admins */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "#f6faf7" }}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]" style={{ color: "#003527" }}>shield_person</span>
            <h2 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
              Organization Admins
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: "#064e3b", color: "#80bea6" }}>
              {adminMembers.length}
            </span>
          </div>
          <p className="text-xs hidden sm:block" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
            Manage staff and attendance
          </p>
        </div>

        {adminMembers.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[36px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>person_off</span>
            <p className="text-sm" style={{ color: "#707974" }}>No admins yet — promote a staff member below.</p>
          </div>
        ) : (
          <div>
            {adminMembers.map((m) => (
              <MemberRow key={m.userId} member={m} isLoading={loadingUserId === m.userId} onSetRole={handleSetRole} />
            ))}
          </div>
        )}
      </div>

      {/* Staff */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
        <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "#f6faf7" }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: "#003527" }}>groups</span>
          <h2 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Staff</h2>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: "#ebefec", color: "#707974" }}>
            {staffMembers.length}
          </span>
        </div>

        {staffMembers.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[36px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>person_off</span>
            <p className="text-sm" style={{ color: "#707974" }}>No staff in this organization yet.</p>
          </div>
        ) : (
          <div>
            {staffMembers.map((m) => (
              <MemberRow key={m.userId} member={m} isLoading={loadingUserId === m.userId} onSetRole={handleSetRole} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
