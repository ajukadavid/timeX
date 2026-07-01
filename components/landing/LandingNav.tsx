"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/platform", label: "Platform" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/why-logasiko", label: "Why Logasiko" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{ backgroundColor: "rgba(246,250,247,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 1px 12px rgba(6,78,59,0.06)", borderBottom: "1px solid rgba(191,201,195,0.3)" }}
      >
        <nav className="flex justify-between items-center h-16 px-6 max-w-screen-xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]" style={{ color: "#003527", fontVariationSettings: "'FILL' 1" }}>eco</span>
              <span className="text-xl font-bold tracking-tight" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Logasiko</span>
            </Link>
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-sm px-3 py-2 rounded-lg transition-all"
                    style={active
                      ? { color: "#003527", fontWeight: "700", borderBottom: "2px solid #ac3400", borderRadius: "0" }
                      : { color: "#404944" }}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm px-5 py-2.5 rounded-lg transition-all font-medium"
              style={{ color: "#003527" }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm px-5 py-2.5 rounded-xl font-bold transition-all"
              style={{ backgroundColor: "#003527", color: "#ffffff" }}
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg" style={{ color: "#003527" }} aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: "rgba(0,53,39,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-80 flex flex-col p-6 shadow-2xl"
            style={{ backgroundColor: "#f6faf7" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]" style={{ color: "#003527", fontVariationSettings: "'FILL' 1" }}>eco</span>
                <span className="font-bold text-lg" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Logasiko</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg" style={{ color: "#707974" }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm px-3 py-3 rounded-lg"
                  style={{ color: "#404944" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-6 border-t" style={{ borderColor: "rgba(191,201,195,0.3)" }}>
              <Link
                href="/login"
                className="py-3 rounded-xl text-sm text-center font-medium border"
                style={{ color: "#003527", borderColor: "rgba(191,201,195,0.5)" }}
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="py-3 rounded-xl text-sm text-center font-bold"
                style={{ backgroundColor: "#003527", color: "#ffffff" }}
                onClick={() => setMobileOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
