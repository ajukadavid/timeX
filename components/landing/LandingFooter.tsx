"use client";

import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/platform" },
      { label: "Attendance", href: "/platform" },
      { label: "Leave Management", href: "/use-cases" },
      { label: "Payroll Integration", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/why-timex" },
      { label: "Sustainability", href: "/why-timex" },
      { label: "Careers", href: "/why-timex" },
      { label: "Press", href: "/resources" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/resources" },
      { label: "Community", href: "/resources" },
      { label: "Status", href: "#" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer style={{ backgroundColor: "#f1f5f2", paddingTop: "6rem", paddingBottom: "3rem" }}>
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[22px]" style={{ color: "#003527", fontVariationSettings: "'FILL' 1" }}>eco</span>
              <span className="text-xl font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Logasiko</span>
            </div>
            <p className="max-w-xs mb-8 leading-relaxed" style={{ color: "#404944" }}>
              Building the technical framework for the sustainable, human-centric workplaces of tomorrow.
            </p>
            <div className="flex gap-3">
              {[
                { icon: "language", href: "#" },
                { icon: "share", href: "#" },
                { icon: "campaign", href: "#" },
              ].map(({ icon, href }) => (
                <a
                  key={icon}
                  href={href}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: "#ffffff", color: "#707974" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#003527";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#ffffff";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#707974";
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h5 className="font-bold mb-6" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
                {section.title}
              </h5>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "#404944" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: "rgba(191,201,195,0.4)" }}
        >
          <p className="text-sm" style={{ color: "#707974" }}>
            © 2026 Logasiko Systems Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#a0d663" }} />
            <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "#707974" }}>
              System Operational
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
