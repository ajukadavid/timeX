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
