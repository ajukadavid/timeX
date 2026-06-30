"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useClerk } from "@clerk/nextjs";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useClerk();
  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (me === null) { router.replace("/login"); return; }
    if (me && me.platformRole !== "superAdmin") {
      if (me.role === "admin") router.replace("/dashboardEmployer");
      else router.replace(`/dashboardStaff/${me._id}`);
    }
  }, [isAuthenticated, isLoading, me, router]);

  if (isLoading || me === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6faf7" }}>
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
          <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "12px", color: "#707974" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!me || me.platformRole !== "superAdmin") return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f6faf7" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ backgroundColor: "#003527", borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]" style={{ color: "#b0f0d6", fontVariationSettings: "'FILL' 1" }}>eco</span>
            <span className="font-bold tracking-wider text-sm" style={{ color: "#ffffff", fontFamily: "var(--font-hanken, sans-serif)" }}>
              Logasiko
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-widest"
              style={{ backgroundColor: "#ac3400", color: "#ffffff" }}
            >
              Super Admin
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-xs hidden sm:block" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#80bea6" }}>
              {me.email}
            </span>
            <button
              onClick={() => signOut().then(() => router.push("/login"))}
              className="flex items-center gap-1.5 text-xs transition-all"
              style={{ color: "#80bea6" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#b0f0d6"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#80bea6"; }}
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
