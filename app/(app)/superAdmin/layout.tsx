"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useClerk } from "@clerk/nextjs";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useClerk();
  const me = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );

  // Guard: redirect if not super admin
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (me === null) {
      router.replace("/login");
      return;
    }
    if (me && me.platformRole !== "superAdmin") {
      // Route to appropriate dashboard based on role
      if (me.role === "admin") {
        router.replace("/dashboardEmployer");
      } else {
        router.replace(`/dashboardStaff/${me._id}`);
      }
    }
  }, [isAuthenticated, isLoading, me, router]);

  if (isLoading || me === undefined) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    );
  }

  if (!me || me.platformRole !== "superAdmin") return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Top nav */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
            TimeX
          </span>
          <span className="text-gray-600">/</span>
          <span className="text-sm font-medium text-gray-300">
            Super Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">{me.email}</span>
          <button
            onClick={() =>
              signOut().then(() => router.push("/login"))
            }
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
