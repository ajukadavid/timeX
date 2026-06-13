"use client";

import { useRouter, usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function StaffDetailLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const displayName = user?.fullName || user?.firstName || "there";
  const isStaffDashboard = pathname.startsWith("/dashboardStaff");

  const handleExit = async () => {
    await signOut({ redirectUrl: "/login" });
  };

  return (
    <div className="flex bg-white min-h-screen flex-col p-8 md:p-20">
      {isStaffDashboard ? (
        <Button type="button" size="lg" color="primary" className="self-start" onClick={handleExit}>
          Save &amp; Exit
        </Button>
      ) : (
        <Button type="button" size="lg" color="primary" className="self-start" onClick={() => router.push("/dashboardEmployer")}>
          Go Back
        </Button>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="w-full h-12">
          <Image src="/logo.png" alt="TimeX" width={64} height={64} className="cursor-pointer" />
        </div>
        <div className="flex flex-col px-10 pt-10">
          <span className="text-2xl font-bold">Hello, {displayName}</span>
          <span className="text-sm font-light">Here is the breakdown of your sign in times</span>
        </div>
      </div>

      <div className="flex items-center justify-center mt-8">
        {children}
      </div>
    </div>
  );
}
