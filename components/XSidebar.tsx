"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type NavItem = {
  label: string;
  icon: string;
  to: string;
  isLogout?: boolean;
};

export function XSidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  const isSuperAdmin = me?.platformRole === "superAdmin";
  const isAdmin = me?.role === "admin";
  const staffDashboardPath = me ? `/dashboardStaff/${me._id}` : "/dashboardStaff";

  const adminLinks: NavItem[] = [
    { label: "Dashboard", icon: "dashboard", to: "/dashboardEmployer" },
    { label: "Workforce", icon: "groups", to: "/user-management" },
    { label: "Reports", icon: "analytics", to: "/reports" },
    { label: "Leave Requests", icon: "event_busy", to: "/leave-requests" },
    { label: "Audit Log", icon: "history", to: "/audit-log" },
  ];

  const staffLinks: NavItem[] = [
    { label: "Dashboard", icon: "dashboard", to: staffDashboardPath },
  ];

  const superAdminLinks: NavItem[] = [
    { label: "Platform", icon: "admin_panel_settings", to: "/superAdmin" },
  ];

  const links: NavItem[] = isSuperAdmin
    ? superAdminLinks
    : isAdmin
    ? adminLinks
    : staffLinks;

  const isActive = (to: string) =>
    pathname === to || pathname.startsWith(to + "/");

  const handleClick = async (item: NavItem) => {
    if (item.isLogout) {
      await signOut({ redirectUrl: "/login" });
    } else {
      router.push(item.to);
    }
    if (window.innerWidth < 768) setOpen(false);
  };

  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-300 ${
          open ? "w-64" : "w-0 md:w-16 overflow-hidden"
        }`}
        style={{ backgroundColor: "#f1f5f2", borderRight: "1px solid #bfc9c3" }}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-3 px-4 py-6 border-b"
          style={{ borderColor: "rgba(191,201,195,0.4)" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#003527" }}
          >
            <span
              className="material-symbols-outlined text-white text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </div>
          {open && (
            <div>
              <p
                className="font-bold leading-none"
                style={{ fontFamily: "var(--font-hanken, sans-serif)", fontSize: "18px", color: "#003527" }}
              >
                Logasiko
              </p>
              <p
                className="text-[11px] mt-0.5"
                style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}
              >
                {isSuperAdmin ? "Super Admin" : isAdmin ? "Management Portal" : "Staff Portal"}
              </p>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map((item) => {
            const active = isActive(item.to);
            return (
              <button
                key={item.to}
                onClick={() => handleClick(item)}
                title={!open ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left ${
                  active
                    ? "font-bold"
                    : "hover:opacity-100"
                }`}
                style={
                  active
                    ? {
                        backgroundColor: "#064e3b",
                        color: "#b0f0d6",
                        borderRight: "3px solid #ac3400",
                      }
                    : {
                        color: "#404944",
                        backgroundColor: "transparent",
                      }
                }
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e5e9e6";
                    (e.currentTarget as HTMLButtonElement).style.color = "#003527";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "#404944";
                  }
                }}
              >
                <span
                  className="material-symbols-outlined shrink-0 text-[22px]"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {open && (
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "12px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer: sign out */}
        <div
          className="px-3 pb-6 pt-4 space-y-1 border-t"
          style={{ borderColor: "rgba(191,201,195,0.3)" }}
        >
          <button
            onClick={() => signOut({ redirectUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
            style={{ color: "#707974" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e5e9e6";
              (e.currentTarget as HTMLButtonElement).style.color = "#003527";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#707974";
            }}
          >
            <span className="material-symbols-outlined shrink-0 text-[22px]">logout</span>
            {open && (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "12px",
                  letterSpacing: "0.02em",
                }}
              >
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg shadow-md border"
        style={{ backgroundColor: "#ffffff", borderColor: "#bfc9c3" }}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-[22px]" style={{ color: "#003527" }}>
          menu
        </span>
      </button>

      {/* Desktop collapse toggle */}
      <button
        className="hidden md:flex fixed bottom-6 z-50 p-1.5 rounded-full border shadow-sm transition-all"
        style={{
          left: open ? "15rem" : "2.5rem",
          backgroundColor: "#ffffff",
          borderColor: "#bfc9c3",
          color: "#003527",
        }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Collapse sidebar"
      >
        <span className="material-symbols-outlined text-[18px]">
          {open ? "chevron_left" : "chevron_right"}
        </span>
      </button>
    </>
  );
}
