"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

function DashboardMockup() {
  const [clockedIn, setClockedIn] = useState(false);

  return (
    <div className="relative">
      {/* Main glass card */}
      <div
        className="relative z-20 rounded-2xl p-6 border"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.6)",
          boxShadow: "0 20px 40px -15px rgba(6,78,59,0.12)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Team Productivity</h3>
          <span className="material-symbols-outlined text-[20px]" style={{ color: "#707974" }}>more_vert</span>
        </div>

        <div className="space-y-3">
          {/* Efficiency row */}
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#ebefec" }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#2c4d00" }}>
              <span className="material-symbols-outlined text-[22px]" style={{ color: "#bbf37c" }}>analytics</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-xs font-mono uppercase tracking-wide" style={{ color: "#181d1b" }}>Efficiency Score</p>
                <p className="text-xs font-mono font-bold" style={{ color: "#003527" }}>94%</p>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#bfc9c3" }}>
                <div className="h-full rounded-full" style={{ width: "94%", backgroundColor: "#ac3400" }} />
              </div>
            </div>
          </div>

          {/* Active members row */}
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#ebefec" }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#b0f0d6" }}>
              <span className="material-symbols-outlined text-[22px]" style={{ color: "#0b513d" }}>groups</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-mono uppercase tracking-wide" style={{ color: "#707974" }}>Active Members</p>
              <p className="font-bold text-xl" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
                42 <span className="text-sm font-normal" style={{ color: "#707974" }}>online now</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification card */}
      <div
        className="absolute -bottom-8 -left-8 z-30 p-4 rounded-xl border w-64"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.6)",
          boxShadow: "0 8px 24px rgba(6,78,59,0.12)",
          animation: "float 4s ease-in-out infinite",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#ac3400" }} />
          <p className="text-xs font-bold" style={{ color: "#003527", fontFamily: "var(--font-jetbrains, monospace)" }}>New Leave Request: Sarah J.</p>
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl z-0 pointer-events-none" style={{ backgroundColor: "rgba(176,240,214,0.25)" }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative pt-16 pb-32 overflow-hidden px-6"
      style={{ backgroundColor: "#f6faf7" }}
    >
      <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div className="z-10">
          <span
            className="inline-block text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
            style={{ backgroundColor: "#b0f0d6", color: "#0b513d" }}
          >
            Introducing Logasiko
          </span>
          <h1
            className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)", letterSpacing: "-0.02em" }}
          >
            Workforce management for the{" "}
            <span style={{ color: "#ac3400" }}>modern era.</span>
          </h1>
          <p
            className="text-lg mb-10 max-w-lg leading-relaxed"
            style={{ color: "#404944" }}
          >
            Streamline attendance, leave, and productivity with a tool your team actually loves. Built for sustainability, designed for humans.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all"
              style={{ backgroundColor: "#064e3b", color: "#b0f0d6", boxShadow: "0 8px 24px -8px rgba(6,78,59,0.4)" }}
            >
              Start Free Trial
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base border transition-all"
              style={{ color: "#003527", borderColor: "#003527" }}
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              Watch Demo
            </Link>
          </div>
          <p className="text-xs mt-5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
            ✓ No credit card required &nbsp;·&nbsp; ✓ 14-day free trial &nbsp;·&nbsp; ✓ Setup in 15 min
          </p>
        </div>

        {/* Right: mockup */}
        <div className="relative hidden lg:block">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
