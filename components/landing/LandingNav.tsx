"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export const navLinks = [
  { href: "/platform", label: "Platform" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/why-timex", label: "Why TimeX" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
];

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="flex justify-between bg-white/95 backdrop-blur-md sticky top-0 items-center px-5 md:px-8 py-4 shadow-sm z-50 border-b border-gray-100">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="TimeX" width={48} height={48} className="rounded-xl shadow-sm" />
            <span className="text-2xl font-bold text-primary hidden sm:block">TimeX</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex gap-3">
          <Link href="/login" className="px-6 py-2.5 text-gray-700 hover:text-primary font-medium rounded-lg hover:bg-gray-50 transition-all">
            Log in
          </Link>
          <Link href="/register" className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all shadow-sm">
            Get Started Free
          </Link>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden" aria-label="Toggle menu">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-primary">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link href="/login" className="block text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </Link>
                <Link href="/register" className="block bg-primary text-white font-medium px-3 py-2 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
