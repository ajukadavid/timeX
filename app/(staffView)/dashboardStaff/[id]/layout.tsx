"use client";

import { use } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function StaffDetailLayout({ children }: { children: React.ReactNode }) {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();

  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  const urlStaffId = pathname.split("/dashboardStaff/")[1]?.split("/")[0];
  const isAdmin = me?.role === "admin" || me?.platformRole === "superAdmin";
  const isViewingOwnPage = me?._id === urlStaffId;
  const showGoBack = isAdmin && !isViewingOwnPage;

  // Fetch viewed staff's name to show correct greeting when admin views someone
  const staffData = useQuery(
    api.staff.getStaffDetail,
    isAuthenticated && urlStaffId ? { staffUserId: urlStaffId as Id<"users"> } : "skip"
  );

  const viewedName = staffData
    ? `${staffData.staff.firstName ?? ""} ${staffData.staff.lastName ?? ""}`.trim() || staffData.staff.email
    : null;

  const greeting = showGoBack && viewedName
    ? `Viewing: ${viewedName}`
    : `Hello, ${clerkUser?.fullName || clerkUser?.firstName || "there"}`;

  const subtitle = showGoBack
    ? "Staff attendance record"
    : "Here is the breakdown of your sign in times";

  const handleExit = async () => {
    await signOut({ redirectUrl: "/login" });
  };

  return (
    <div className="flex bg-white min-h-screen flex-col p-8 md:p-20">
      {showGoBack ? (
        <Button
          type="button"
          size="lg"
          color="primary"
          className="self-start"
          onClick={() => router.push("/dashboardEmployer")}
        >
          ← Go Back
        </Button>
      ) : (
        <Button type="button" size="lg" color="primary" className="self-start" onClick={handleExit}>
          Save &amp; Exit
        </Button>
      )}

      <div className="flex items-center justify-between mt-4">
        <div
          className="w-full h-12 cursor-pointer"
          onClick={() => router.push(showGoBack ? "/dashboardEmployer" : "/dashboardStaff")}
        >
          <Image src="/logo.png" alt="TimeX" width={64} height={64} />
        </div>
        <div className="flex flex-col px-10 pt-10">
          <span className="text-2xl font-bold">{greeting}</span>
          <span className="text-sm font-light text-gray-500">{subtitle}</span>
        </div>
      </div>

      <div className="flex items-center justify-center mt-8">
        {children}
      </div>
    </div>
  );
}
