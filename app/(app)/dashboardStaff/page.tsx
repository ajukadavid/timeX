"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardStaffRedirect() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [error, setError] = useState<string | null>(null);

  const linkUser = useMutation(api.users.linkAuthenticatedUser);
  const postLoginPath = useQuery(
    api.users.getPostLoginPath,
    isAuthenticated ? {} : "skip"
  );

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    let cancelled = false;

    async function run() {
      try {
        await linkUser({});
      } catch (e) {
        if (!cancelled) setError("Could not link your account. Please sign in again.");
        return;
      }

      if (!cancelled && postLoginPath) {
        router.replace(postLoginPath);
      } else if (!cancelled && postLoginPath === null) {
        setError("We could not find your account. Sign in with the email you were invited with.");
      }
    }

    void run();
    return () => { cancelled = true; };
  }, [isAuthenticated, isLoading, postLoginPath, linkUser, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="max-w-md text-center text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Loading your dashboard…</p>
    </div>
  );
}
