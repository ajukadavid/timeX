"use client";

import { useState } from "react";
import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import {
  MarketingButton,
  MarketingCard,
  MarketingHeading,
  MarketingHero,
  MarketingPage,
  MarketingSection,
} from "@/components/landing/MarketingUi";

const plans = [
  {
    name: "Starter",
    description: "For small teams getting started with digital attendance.",
    price: "$9",
    featured: false,
    features: ["Up to 10 staff", "Clock-in / clock-out", "Leave requests", "Email support"],
  },
  {
    name: "Professional",
    description: "For growing organisations that need premium presence tools.",
    price: "$19",
    featured: true,
    features: [
      "Up to 50 staff",
      "Geofencing & biometrics",
      "Offline sync",
      "Real-time analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    description: "For large organisations with custom requirements.",
    price: "Custom",
    featured: false,
    features: [
      "Unlimited staff",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 premium support",
      "Custom SLA",
    ],
  },
];

const faqs = [
  { q: "Can I change plans later?", a: "Yes — upgrade or downgrade anytime. Changes apply on your next billing cycle." },
  { q: "Is there a free trial?", a: "Yes. Every plan includes a 14-day free trial. No credit card required." },
  { q: "What are premium features?", a: "Geofencing, biometric auth, and offline sync are available on paid plans. Your Logasiko admin enables them per organisation." },
  { q: "Can I cancel anytime?", a: "Yes. No long-term contracts — cancel whenever you need." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <MarketingPage>
      <MarketingHero
        eyebrow="Pricing"
        title={
          <>
            Simple, transparent <br />
            <span style={{ color: "#ac3400" }}>pricing</span>
          </>
        }
        description="Choose the plan that fits your team. Scale up as you grow — premium presence features unlock on paid tiers."
        centered
      >
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm font-mono" style={{ color: annual ? "#707974" : "#003527" }}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setAnnual(!annual)}
            className="relative w-11 h-6 rounded-full transition-colors"
            style={{ backgroundColor: annual ? "#003527" : "#dfe3e1" }}
            aria-label="Toggle annual billing"
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
              style={{ transform: annual ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
          <span className="text-sm font-mono" style={{ color: annual ? "#003527" : "#707974" }}>
            Annual <span style={{ color: "#ac3400" }}>(Save 20%)</span>
          </span>
        </div>
      </MarketingHero>

      <MarketingSection variant="muted">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <MarketingCard key={plan.name} featured={plan.featured} className="relative flex flex-col">
              {plan.featured && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{ backgroundColor: "#ac3400", color: "#ffffff", fontFamily: "var(--font-jetbrains, monospace)" }}
                >
                  Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2" style={{ color: plan.featured ? "#ffffff" : "#003527" }}>
                {plan.name}
              </h3>
              <p className="text-sm mb-6" style={{ color: plan.featured ? "rgba(255,255,255,0.7)" : "#707974" }}>
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: plan.featured ? "#b0f0d6" : "#003527" }}>
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-sm ml-1" style={{ color: plan.featured ? "rgba(255,255,255,0.6)" : "#707974" }}>
                    /user/mo
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: plan.featured ? "#bbf37c" : "#ac3400", fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span style={{ color: plan.featured ? "rgba(255,255,255,0.85)" : "#404944" }}>{f}</span>
                  </li>
                ))}
              </ul>
              {plan.name === "Enterprise" ? (
                <MarketingButton variant={plan.featured ? "primary" : "outline"} className="w-full">
                  Contact Sales
                </MarketingButton>
              ) : (
                <Link
                  href="/register"
                  className="w-full inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
                  style={
                    plan.featured
                      ? { backgroundColor: "#ac3400", color: "#ffffff" }
                      : { backgroundColor: "#003527", color: "#ffffff" }
                  }
                >
                  Start Free Trial
                </Link>
              )}
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection variant="white">
        <MarketingHeading title="Frequently asked questions" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <MarketingCard key={faq.q}>
              <h3 className="text-lg font-bold mb-3" style={{ color: "#003527" }}>
                {faq.q}
              </h3>
              <p style={{ color: "#404944" }}>{faq.a}</p>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <LandingCta title="Ready to get started?" primaryLabel="Start Your Free Trial" />
    </MarketingPage>
  );
}
