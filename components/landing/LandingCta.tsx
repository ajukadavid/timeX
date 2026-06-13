import Link from "next/link";

interface LandingCtaProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export function LandingCta({
  title = "Ready to Transform Your Workforce Management?",
  subtitle = "Join thousands of companies already using TimeX to optimize their operations",
  primaryLabel = "Start Free Trial",
  secondaryLabel = "Contact Sales",
}: LandingCtaProps) {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-8 opacity-90">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register" className="btn-white">
            {primaryLabel}
          </Link>
          <button type="button" className="btn-outline-white">
            {secondaryLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
