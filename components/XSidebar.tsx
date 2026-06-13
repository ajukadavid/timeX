"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const icons = {
  squares: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  "user-plus": "M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z",
  logout: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
};

type LinkDef = { label: string; icon: keyof typeof icons; to: string; isLogout?: boolean };

export function XSidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  const isAdmin = me?.role === "admin";
  const staffDashboardPath = me ? `/dashboardStaff/${me._id}` : "/dashboardStaff";

  const links: LinkDef[] = isAdmin
    ? [
        { label: "Dashboard", icon: "squares", to: "/dashboardEmployer" },
        { label: "User Management", icon: "user-plus", to: "/user-management" },
        { label: "Log out", icon: "logout", to: "/login", isLogout: true },
      ]
    : [
        { label: "Dashboard", icon: "squares", to: staffDashboardPath },
        { label: "Log out", icon: "logout", to: "/login", isLogout: true },
      ];

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");

  const handleClick = async (link: typeof links[0]) => {
    if (link.isLogout) {
      await signOut({ redirectUrl: "/login" });
    } else {
      router.push(link.to);
    }
  };

  return (
    <>
      <aside
        className={`h-screen fixed bg-white border-r border-gray-300 flex flex-col transition-all duration-300 z-50 ${
          open ? "w-64 translate-x-0" : "w-0 md:w-16 -translate-x-full md:translate-x-0"
        }`}
      >
        <div className={`py-4 border-b flex items-center justify-center border-gray-300 bg-gray-50 ${open ? "px-6" : "px-2"}`}>
          {open ? (
            <h2 className="font-sans text-2xl cursor-pointer font-bold text-primary-700" onClick={() => setOpen(false)}>
              TimeX
            </h2>
          ) : (
            <button onClick={() => setOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Toggle sidebar">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          )}
        </div>

        <div className={`space-y-2 overflow-y-auto flex-1 py-4 ${open ? "px-4" : "px-2"}`}>
          {links.map((link) => (
            <button
              key={link.to}
              onClick={() => handleClick(link)}
              className={`group relative flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 w-full ${
                isActive(link.to)
                  ? "text-white bg-primary-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[link.icon]} />
              </svg>
              {open && <span className="flex-1 text-left">{link.label}</span>}
            </button>
          ))}
        </div>
      </aside>

      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white rounded-lg shadow-md border border-gray-300"
        onClick={() => setOpen(true)}
        aria-label="Toggle sidebar"
      >
        {!open && (
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>
    </>
  );
}
