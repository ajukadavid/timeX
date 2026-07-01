import Link from "next/link";

interface LandingCtaProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function LandingCta({
  title = "Ready to evolve your workforce?",
  subtitle = "Experience the perfect synergy of technical precision and human-centric design. Logasiko is ready when you are.",
  primaryLabel = "Start Your Free Trial",
  primaryHref = "/register",
  secondaryLabel = "Talk to Sales",
  secondaryHref = "/pricing",
}: LandingCtaProps) {
  return (
    <section className="py-24 lg:py-32 px-6" style={{ backgroundColor: "#f1f5f2" }}>
      <div className="max-w-screen-xl mx-auto">
        <div
          className="rounded-[3rem] p-12 lg:p-24 flex flex-col items-center text-center relative overflow-hidden"
          style={{ backgroundColor: "#003527", boxShadow: "0 20px 40px -15px rgba(6,78,59,0.3)" }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: "#b0f0d6" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: "#bbf37c" }} />

          <div className="relative z-10 flex flex-col items-center">
            <span className="material-symbols-outlined text-[40px] mb-6" style={{ color: "#b0f0d6", fontVariationSettings: "'FILL' 1" }}>
              eco
            </span>
            <h2
              className="text-3xl lg:text-5xl font-bold text-white mb-6 max-w-2xl"
              style={{ fontFamily: "var(--font-hanken, sans-serif)", letterSpacing: "-0.02em" }}
            >
              {title}
            </h2>
            <p className="text-lg mb-10 max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={primaryHref}
                className="px-10 py-5 rounded-2xl font-bold text-base transition-all hover:opacity-90"
                style={{ backgroundColor: "#ac3400", color: "#ffffff" }}
              >
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                className="px-10 py-5 rounded-2xl font-bold text-base border transition-all hover:bg-white/10"
                style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                {secondaryLabel}
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
