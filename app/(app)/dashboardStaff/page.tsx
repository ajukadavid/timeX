"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardStaffRedirect() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [linked, setLinked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkUser = useMutation(api.users.linkAuthenticatedUser);
  const postLoginPath = useQuery(
    api.users.getPostLoginPath,
    isAuthenticated && linked ? {} : "skip"
  );

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    let cancelled = false;

    async function run() {
      try {
        await linkUser({});
        if (!cancelled) setLinked(true);
      } catch {
        if (!cancelled) {
          setError("Could not link your account. Please sign in again.");
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, linkUser]);

  useEffect(() => {
    if (!linked || postLoginPath === undefined) return;

    if (postLoginPath) {
      router.replace(postLoginPath);
      return;
    }

    setError(
      "We could not find your account. Sign in with the email you were invited with."
    );
  }, [linked, postLoginPath, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={{ backgroundColor: "#f6faf7" }}>
        <div className="text-center max-w-md space-y-4">
          <span className="material-symbols-outlined text-[48px]" style={{ color: "#ba1a1a", fontVariationSettings: "'FILL' 1" }}>error</span>
          <p style={{ color: "#404944", fontFamily: "var(--font-hanken, sans-serif)" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6faf7" }}>
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-[48px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "12px", color: "#707974" }}>Loading your dashboard…</p>
      </div>
    </div>
  );
}
