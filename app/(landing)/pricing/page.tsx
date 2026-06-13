"use client";

import { useState } from "react";
import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { CheckIcon, XIcon } from "@/components/landing/MarketingIcons";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started",
    price: "$9",
    featured: false,
    features: ["Up to 10 employees", "Basic time tracking", "Mobile app access", "Email support"],
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses",
    price: "$19",
    featured: true,
    features: ["Up to 50 employees", "AI-powered time tracking", "GPS verification", "Real-time analytics", "Priority support"],
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "Custom",
    featured: false,
    features: ["Unlimited employees", "Custom integrations", "Dedicated account manager", "24/7 premium support", "Custom SLA"],
  },
];

const comparisonRows = [
  { feature: "Time Tracking", starter: "Basic", pro: "AI-Powered", enterprise: "AI-Powered + Custom" },
  { feature: "GPS Verification", starter: false, pro: true, enterprise: true },
  { feature: "Analytics", starter: "Basic Reports", pro: "Advanced Analytics", enterprise: "Custom Reports" },
  { feature: "Mobile Access", starter: "Limited", pro: "Full Access", enterprise: "Full Access + Custom Apps" },
  { feature: "Support", starter: "Email", pro: "Priority", enterprise: "24/7 Premium" },
  { feature: "API Access", starter: false, pro: "Limited", enterprise: "Full Access" },
];

const faqs = [
  { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle." },
  { q: "Is there a free trial?", a: "Yes, we offer a 14-day free trial for all plans. No credit card required." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. No long-term contracts required." },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <CheckIcon className="w-6 h-6 text-green-500 mx-auto" />;
  if (value === false) return <XIcon />;
  return <>{value}</>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Simple, Transparent <br />
              <span className="text-primary">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the perfect plan for your business. All plans include core features with flexible scaling options.
            </p>
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={annual ? "text-gray-600" : "text-gray-900 font-medium"}>Monthly</span>
              <button
                type="button"
                onClick={() => setAnnual(!annual)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${annual ? "bg-primary" : "bg-gray-300"}`}
                aria-label="Toggle annual billing"
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${annual ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className={annual ? "text-gray-900 font-medium" : "text-gray-600"}>
                Annual <span className="text-primary">(Save 20%)</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className={plan.featured ? "pricing-card-featured" : "pricing-card"}>
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-600">/user/month</span>}
                  </div>
                  {plan.name === "Enterprise" ? (
                    <button type="button" className="btn-outline-primary w-full mb-8">Contact Sales</button>
                  ) : plan.featured ? (
                    <Link href="/register" className="btn-primary w-full mb-8 block text-center">Start Free Trial</Link>
                  ) : (
                    <Link href="/register" className="btn-outline-primary w-full mb-8 block text-center">Start Free Trial</Link>
                  )}
                  <ul className="space-y-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center">
                        <CheckIcon className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Compare Plans in Detail</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-6 text-left">Features</th>
                  <th className="p-6 text-center">Starter</th>
                  <th className="p-6 text-center text-primary">Professional</th>
                  <th className="p-6 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b last:border-0">
                    <td className="p-6 font-semibold">{row.feature}</td>
                    <td className="p-6 text-center"><CellValue value={row.starter} /></td>
                    <td className="p-6 text-center"><CellValue value={row.pro} /></td>
                    <td className="p-6 text-center"><CellValue value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingCta title="Ready to Get Started?" />
    </div>
  );
}
