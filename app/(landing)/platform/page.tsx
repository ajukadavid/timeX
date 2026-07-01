import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import {
  MarketingButton,
  MarketingCard,
  MarketingCheckList,
  MarketingHeading,
  MarketingHero,
  MarketingIconBox,
  MarketingPage,
  MarketingSection,
} from "@/components/landing/MarketingUi";

const features = [
  { title: "Frictionless Clock-In", description: "One-tap sign-in with geofencing, biometric verification, and offline sync for field teams.", icon: "fingerprint", variant: "dark" as const },
  { title: "Geo-fenced Zones", description: "Define work zones and block clock-ins outside your organisation's approved radius.", icon: "location_on", variant: "mint" as const },
  { title: "Live Analytics", description: "Real-time attendance dashboards with on-time, late, and absent counts that update instantly.", icon: "analytics", variant: "lime" as const },
  { title: "Leave Management", description: "Transparent PTO workflows with approvals, status tracking, and team calendar visibility.", icon: "event_available", variant: "terracotta" as const },
  { title: "Mobile-First Staff Portal", description: "A beautiful staff experience designed for phones — clock in, request leave, view history.", icon: "smartphone", variant: "mint" as const },
  { title: "Audit & Compliance", description: "Full audit log of admin actions, manual entries, and role changes for accountability.", icon: "verified_user", variant: "dark" as const },
];

export default function PlatformPage() {
  return (
    <MarketingPage>
      <MarketingHero
        eyebrow="Platform"
        title={
          <>
            The modern workforce <br />
            <span style={{ color: "#ac3400" }}>command center</span>
          </>
        }
        description="Logasiko combines precision attendance tracking, leave management, and real-time insights in one nature-tech platform built for teams that move."
      >
        <div className="flex flex-wrap gap-4">
          <MarketingButton href="/register">Start Free Trial</MarketingButton>
          <MarketingButton href="/pricing" variant="outline">
            View Pricing
          </MarketingButton>
        </div>
      </MarketingHero>

      <MarketingSection variant="muted">
        <MarketingHeading
          title="Built for precision teams"
          description="Everything you need to manage presence, leave, and performance — without the spreadsheet chaos."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <MarketingCard key={f.title}>
              <MarketingIconBox icon={f.icon} variant={f.variant} />
              <h3 className="text-xl font-bold mt-6 mb-3" style={{ color: "#003527" }}>
                {f.title}
              </h3>
              <p style={{ color: "#404944" }}>{f.description}</p>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection variant="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <MarketingHeading
              title="Seamless by design"
              description="Logasiko fits into how your team already works — no clunky hardware, no painful rollouts."
              centered={false}
            />
            <MarketingCheckList
              items={[
                "Real-time reactive dashboards",
                "Org timezone-aware attendance",
                "Per-department sign-in deadlines",
                "CSV export and audit trails",
              ]}
            />
          </div>
          <MarketingCard featured className="p-10">
            <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#80bea6" }}>
              Live snapshot
            </p>
            <div className="space-y-4">
              {[
                { label: "Signed in today", value: "38", icon: "login" },
                { label: "On time", value: "34", icon: "check_circle" },
                { label: "Late arrivals", value: "4", icon: "alarm_on" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: "#b0f0d6" }}>
                      {row.icon}
                    </span>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                      {row.label}
                    </span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: "#b0f0d6" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </MarketingCard>
        </div>
      </MarketingSection>

      <MarketingSection>
        <MarketingHeading
          title="Works where your team works"
          description="From office floors to logistics hubs — configure geofences, roles, and policies per organisation."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: "corporate_fare", label: "Offices" },
            { icon: "local_shipping", label: "Logistics" },
            { icon: "health_and_safety", label: "Healthcare" },
            { icon: "storefront", label: "Retail" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 text-center">
              <MarketingIconBox icon={icon} variant="mint" />
              <p className="font-bold text-sm" style={{ color: "#003527" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/use-cases" className="inline-flex items-center gap-2 font-bold text-sm" style={{ color: "#ac3400" }}>
            Explore use cases
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </MarketingSection>

      <LandingCta />
    </MarketingPage>
  );
}
