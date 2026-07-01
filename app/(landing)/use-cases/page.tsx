import { LandingCta } from "@/components/landing/LandingCta";
import {
  MarketingCard,
  MarketingHeading,
  MarketingHero,
  MarketingIconBox,
  MarketingPage,
  MarketingSection,
  MarketingStat,
} from "@/components/landing/MarketingUi";

const cases = [
  {
    title: "Manufacturing & Logistics",
    description: "Shift-based teams clock in at hub locations with geofencing — reducing buddy-punching and payroll disputes.",
    icon: "local_shipping",
    stats: [
      { value: "35%", label: "Fewer disputes" },
      { value: "2.5h", label: "Admin saved / week" },
    ],
  },
  {
    title: "Healthcare & Clinics",
    description: "Roster staff across departments with per-deadline sign-in rules and instant late alerts for managers.",
    icon: "health_and_safety",
    stats: [
      { value: "45%", label: "Less admin time" },
      { value: "99.9%", label: "Schedule accuracy" },
    ],
  },
  {
    title: "Retail & Hospitality",
    description: "Mobile-first clock-in for floor staff with offline sync when store Wi-Fi drops during peak hours.",
    icon: "storefront",
    stats: [
      { value: "28%", label: "Cost reduction" },
      { value: "4.8★", label: "Staff satisfaction" },
    ],
  },
];

const stories = [
  {
    company: "Greenfield Logistics",
    industry: "Logistics",
    quote: "Logasiko replaced three spreadsheets and a broken punch clock. Our managers finally see who's on site in real time.",
    name: "Sarah Jenkins",
    role: "Operations Director",
  },
  {
    company: "Harbor Medical Group",
    industry: "Healthcare",
    quote: "Biometric sign-in and geofencing gave us the audit trail we needed without slowing staff down at shift change.",
    name: "Dr. Michael Chen",
    role: "Clinical Administrator",
  },
];

export default function UseCasesPage() {
  return (
    <MarketingPage>
      <MarketingHero
        eyebrow="Use Cases"
        title={
          <>
            Built for teams <br />
            <span style={{ color: "#ac3400" }}>that show up</span>
          </>
        }
        description="See how organisations use Logasiko to track presence accurately, manage leave fairly, and give managers live visibility."
        centered
      />

      <MarketingSection variant="muted">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c) => (
            <MarketingCard key={c.title}>
              <MarketingIconBox icon={c.icon} variant="dark" />
              <h3 className="text-xl font-bold mt-6 mb-3" style={{ color: "#003527" }}>
                {c.title}
              </h3>
              <p className="mb-6" style={{ color: "#404944" }}>
                {c.description}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {c.stats.map((s) => (
                  <div key={s.label} className="p-4 rounded-xl" style={{ backgroundColor: "#f1f5f2" }}>
                    <p className="text-2xl font-bold" style={{ color: "#003527" }}>
                      {s.value}
                    </p>
                    <p className="text-xs font-mono mt-1" style={{ color: "#707974" }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection variant="white">
        <MarketingHeading title="What teams are saying" description="Real outcomes from organisations running on Logasiko." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((s) => (
            <MarketingCard key={s.company}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#064e3b" }}>
                  <span className="material-symbols-outlined text-[22px]" style={{ color: "#b0f0d6", fontVariationSettings: "'FILL' 1" }}>
                    corporate_fare
                  </span>
                </div>
                <div>
                  <p className="font-bold" style={{ color: "#003527" }}>
                    {s.company}
                  </p>
                  <p className="text-xs font-mono" style={{ color: "#707974" }}>
                    {s.industry}
                  </p>
                </div>
              </div>
              <blockquote className="text-base mb-6 italic" style={{ color: "#404944" }}>
                &ldquo;{s.quote}&rdquo;
              </blockquote>
              <p className="font-semibold text-sm" style={{ color: "#003527" }}>
                {s.name}
              </p>
              <p className="text-xs font-mono" style={{ color: "#707974" }}>
                {s.role}
              </p>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection>
        <MarketingHeading
          title="The numbers speak"
          description="Organisations on Logasiko report faster admin, happier staff, and cleaner payroll data."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          <MarketingStat value="99.9%" label="Uptime" />
          <MarketingStat value="250k+" label="Daily sign-ins" />
          <MarketingStat value="15 min" label="Setup time" />
          <MarketingStat value="24/7" label="Support" />
        </div>
      </MarketingSection>

      <LandingCta title="Ready to write your success story?" />
    </MarketingPage>
  );
}
