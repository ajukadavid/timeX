import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";

// ─── Features bento grid ──────────────────────────────────────

function FeaturesSection() {
  return (
    <section style={{ backgroundColor: "#f1f5f2", padding: "8rem 0" }}>
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)", letterSpacing: "-0.02em" }}>
            Precision tools for precision teams
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#404944" }}>
            Logasiko bridges the gap between high-tech management and the organic flow of a creative workforce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Clock-in — large bento */}
          <div
            className="md:col-span-8 rounded-2xl p-8 border flex flex-col md:flex-row gap-8 items-center"
            style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)", boxShadow: "0 20px 40px -15px rgba(6,78,59,0.08)" }}
          >
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Frictionless Presence</h3>
              <p className="mb-6" style={{ color: "#404944" }}>
                Our one-tap clock-in system uses geofencing and biometric verification to ensure accurate data without the hassle.
              </p>
              <ul className="space-y-3">
                {["Geo-fenced Zones", "Biometric Auth", "Offline Syncing"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-bold" style={{ color: "#003527", fontFamily: "var(--font-jetbrains, monospace)" }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: "#ac3400", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Clock-in button visual */}
            <div
              className="w-full md:w-64 shrink-0 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: "#064e3b", aspectRatio: "1" }}
            >
              <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at center, white, transparent)" }} />
              <div className="relative z-10 text-center">
                <p className="text-xs font-mono mb-3" style={{ color: "#80bea6" }}>09:00:00 AM</p>
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: "#ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
                >
                  <span className="material-symbols-outlined text-5xl" style={{ color: "#064e3b", fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
                </div>
                <p className="mt-4 font-bold" style={{ color: "#b0f0d6", fontFamily: "var(--font-hanken, sans-serif)" }}>Clock In</p>
              </div>
            </div>
          </div>

          {/* PTO — small bento */}
          <div
            className="md:col-span-4 rounded-2xl p-8 relative overflow-hidden"
            style={{ backgroundColor: "#064e3b", boxShadow: "0 20px 40px -15px rgba(6,78,59,0.15)" }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "72px", fontVariationSettings: "'FILL' 1" }}>event_available</span>
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: "#ffffff", fontFamily: "var(--font-hanken, sans-serif)" }}>PTO Harmony</h3>
            <p className="mb-8 text-sm" style={{ color: "rgba(176,240,214,0.8)" }}>
              Balance work and life with transparent leave management that respects everyone's time.
            </p>
            <div className="space-y-4">
              {[
                { name: "Sarah Jenkins", type: "SICK LEAVE", typeBg: "#ac3400", typeColor: "#fff" },
                { name: "Marcus Thorne", type: "VACATION", typeBg: "#bbf37c", typeColor: "#0f2000" },
              ].map((r) => (
                <div key={r.name} className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <span className="text-xs font-mono" style={{ color: "#b0f0d6" }}>{r.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: r.typeBg, color: r.typeColor }}>{r.type}</span>
                </div>
              ))}
            </div>
            <Link href="/register" className="mt-8 inline-flex items-center gap-2 font-bold text-sm transition-all" style={{ color: "#b0f0d6" }}>
              View Calendar <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          {/* Live Insights — small bento */}
          <div
            className="md:col-span-4 rounded-2xl p-8 border flex flex-col justify-between"
            style={{ backgroundColor: "#dfe3e1", borderColor: "rgba(191,201,195,0.3)" }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Live Insights</h3>
              <p className="text-xs font-mono mb-6" style={{ color: "#707974" }}>Real-time team velocity</p>
              {/* Mini bar chart */}
              <div className="flex gap-2 items-end h-20 mb-4">
                {[50, 75, 100, 65, 80].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: i === 2 ? "#ac3400" : "#003527", opacity: i === 2 ? 1 : 0.6 }} />
                ))}
              </div>
            </div>
            <p className="text-sm" style={{ color: "#707974" }}>
              Active project: <span className="font-bold" style={{ color: "#003527" }}>Sustainable Infrastructure V2</span>
            </p>
          </div>

          {/* Team photo — large bento */}
          <div
            className="md:col-span-8 h-80 rounded-2xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #003527 0%, #064e3b 40%, #2c4d00 100%)" }}
          >
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(176,240,214,0.8) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(187,243,124,0.6) 0%, transparent 40%)" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-[28px]" style={{ color: "#b0f0d6", fontVariationSettings: "'FILL' 1" }}>groups</span>
                <h4 className="text-2xl font-bold" style={{ color: "#ffffff", fontFamily: "var(--font-hanken, sans-serif)" }}>Engineered for Collaboration</h4>
              </div>
              <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: "36rem" }}>
                Join over 1,500 companies that have redefined their workplace culture with Logasiko.
              </p>
              <div className="flex gap-4 mt-5">
                {[
                  { label: "Companies", value: "1,500+" },
                  { label: "Daily logins", value: "250k+" },
                  { label: "Uptime", value: "99.9%" },
                ].map(({ label, value }) => (
                  <div key={label} className="border-l pl-4" style={{ borderColor: "rgba(176,240,214,0.3)" }}>
                    <p className="font-bold text-lg" style={{ color: "#b0f0d6", fontFamily: "var(--font-hanken, sans-serif)" }}>{value}</p>
                    <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats section ────────────────────────────────────────────

function StatsSection() {
  const stats = [
    { value: "99.9%", label: "Uptime", color: "#003527" },
    { value: "250k+", label: "Daily Logins", color: "#ac3400" },
    { value: "15 min", label: "Setup Time", color: "#003527" },
    { value: "24/7", label: "Human Support", color: "#003527" },
  ];

  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#f6faf7" }}>
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
        {stats.map(({ value, label, color }) => (
          <div key={label}>
            <p className="text-5xl font-bold mb-2" style={{ color, fontFamily: "var(--font-hanken, sans-serif)", letterSpacing: "-0.02em" }}>{value}</p>
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#707974" }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA section ─────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="py-32 px-6 relative" style={{ backgroundColor: "#f1f5f2" }}>
      <div className="max-w-screen-xl mx-auto">
        <div
          className="rounded-[3rem] p-16 lg:p-24 flex flex-col items-center text-center relative overflow-hidden"
          style={{ backgroundColor: "#003527", boxShadow: "0 20px 40px -15px rgba(6,78,59,0.3)" }}
        >
          {/* Background decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: "#b0f0d6" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: "#bbf37c" }} />

          <div className="relative z-10 flex flex-col items-center">
            <span className="material-symbols-outlined text-[40px] mb-6" style={{ color: "#b0f0d6", fontVariationSettings: "'FILL' 1" }}>eco</span>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-hanken, sans-serif)", letterSpacing: "-0.02em", maxWidth: "36rem" }}
            >
              Ready to evolve your workforce?
            </h2>
            <p className="text-lg mb-12 max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
              Experience the perfect synergy of technical precision and human-centric design. Logasiko is ready when you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-10 py-5 rounded-2xl font-bold text-base transition-all"
                style={{ backgroundColor: "#ac3400", color: "#ffffff" }}
              >
                Start Your Free Trial
              </Link>
              <Link
                href="/pricing"
                className="px-10 py-5 rounded-2xl font-bold text-base border transition-all"
                style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                Talk to Sales
              </Link>
            </div>
            <p className="text-xs mt-6 font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CtaSection />
    </>
  );
}
