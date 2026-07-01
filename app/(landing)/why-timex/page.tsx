import { LandingCta } from "@/components/landing/LandingCta";
import {
  MarketingCard,
  MarketingCheckList,
  MarketingHeading,
  MarketingHero,
  MarketingIconBox,
  MarketingPage,
  MarketingSection,
  MarketingStat,
} from "@/components/landing/MarketingUi";

const features = [
  {
    title: "Nature-tech design",
    description: "A calm, focused interface that staff actually want to use — not another corporate HR portal.",
    icon: "eco",
    variant: "dark" as const,
    bullets: ["Mobile-first staff portal", "Real-time reactive data", "Accessible typography"],
  },
  {
    title: "Premium presence tools",
    description: "Geofencing, biometric verification, and offline sync — gated by subscription so you only pay for what you need.",
    icon: "fingerprint",
    variant: "mint" as const,
    bullets: ["Geo-fenced clock-in", "WebAuthn biometrics", "Offline queue sync"],
  },
  {
    title: "Built on Convex",
    description: "Sub-100ms updates, automatic reactivity, and a backend that scales without DevOps overhead.",
    icon: "bolt",
    variant: "lime" as const,
    bullets: ["Live dashboards", "Zero WebSocket code", "Type-safe APIs"],
  },
];

const comparison = [
  { feature: "Real-time attendance", logasiko: true, traditional: "Delayed reports" },
  { feature: "Geofenced clock-in", logasiko: true, traditional: false },
  { feature: "Biometric verification", logasiko: true, traditional: false },
  { feature: "Offline sync", logasiko: true, traditional: false },
  { feature: "Leave management", logasiko: true, traditional: "Separate tool" },
  { feature: "Audit log", logasiko: true, traditional: "Limited" },
];

export default function WhyLogasikoPage() {
  return (
    <MarketingPage>
      <MarketingHero
        eyebrow="Why Logasiko"
        title={
          <>
            Workforce management, <br />
            <span style={{ color: "#ac3400" }}>reimagined</span>
          </>
        }
        description="Logasiko is the nature-tech platform for teams who care about accuracy, fairness, and a staff experience that doesn't feel like punishment."
      >
        <div className="grid grid-cols-2 gap-4 max-w-md">
          {[
            { value: "99.9%", label: "Uptime" },
            { value: "500+", label: "Teams" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
              <MarketingStat value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </MarketingHero>

      <MarketingSection variant="muted">
        <MarketingHeading title="What sets us apart" description="Precision tools wrapped in a human-centric experience." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <MarketingCard key={f.title}>
              <MarketingIconBox icon={f.icon} variant={f.variant} />
              <h3 className="text-xl font-bold mt-6 mb-3" style={{ color: "#003527" }}>
                {f.title}
              </h3>
              <p className="mb-5" style={{ color: "#404944" }}>
                {f.description}
              </p>
              <MarketingCheckList items={f.bullets} />
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection variant="white">
        <MarketingHeading title="Logasiko vs. traditional tools" description="See how we compare to legacy punch clocks and spreadsheet workflows." />
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "rgba(191,201,195,0.3)" }}>
          <table className="w-full text-left" style={{ backgroundColor: "#ffffff" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f2", borderBottom: "1px solid rgba(191,201,195,0.3)" }}>
                <th className="p-5 text-left text-xs font-mono uppercase tracking-wider" style={{ color: "#707974" }}>
                  Feature
                </th>
                <th className="p-5 text-center text-xs font-mono uppercase tracking-wider" style={{ color: "#003527" }}>
                  Logasiko
                </th>
                <th className="p-5 text-center text-xs font-mono uppercase tracking-wider" style={{ color: "#707974" }}>
                  Traditional
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} style={{ borderBottom: "1px solid rgba(191,201,195,0.15)" }}>
                  <td className="p-5 font-semibold text-sm" style={{ color: "#181d1b" }}>
                    {row.feature}
                  </td>
                  <td className="p-5 text-center">
                    {row.logasiko === true ? (
                      <span className="material-symbols-outlined text-[22px]" style={{ color: "#003527", fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    ) : (
                      <span className="text-sm" style={{ color: "#404944" }}>
                        {String(row.logasiko)}
                      </span>
                    )}
                  </td>
                  <td className="p-5 text-center">
                    {row.traditional === false ? (
                      <span className="material-symbols-outlined text-[22px]" style={{ color: "#bfc9c3" }}>
                        cancel
                      </span>
                    ) : (
                      <span className="text-sm" style={{ color: "#707974" }}>
                        {String(row.traditional)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MarketingSection>

      <MarketingSection>
        <MarketingHeading title="Trusted by forward-thinking teams" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          <MarketingStat value="30%" label="Admin time saved" />
          <MarketingStat value="1,500+" label="Organisations" />
          <MarketingStat value="<100ms" label="Update latency" />
          <MarketingStat value="14-day" label="Free trial" />
        </div>
      </MarketingSection>

      <LandingCta title="Ready to experience the Logasiko difference?" />
    </MarketingPage>
  );
}
