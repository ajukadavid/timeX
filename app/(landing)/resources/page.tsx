import { LandingCta } from "@/components/landing/LandingCta";
import {
  MarketingButton,
  MarketingCard,
  MarketingHeading,
  MarketingHero,
  MarketingIconBox,
  MarketingPage,
  MarketingSection,
} from "@/components/landing/MarketingUi";

const quickLinks = [
  { title: "Getting Started", description: "Set up your organisation in under 15 minutes.", icon: "rocket_launch" },
  { title: "Admin Guide", description: "Departments, sign-in times, and premium features.", icon: "admin_panel_settings" },
  { title: "Staff Portal", description: "How clock-in, leave, and history work on mobile.", icon: "smartphone" },
  { title: "Help Center", description: "FAQs, troubleshooting, and contact support.", icon: "support_agent" },
];

const resources = [
  { tag: "Getting Started", title: "Quick Start Guide", description: "Create your organisation, invite staff, and configure sign-in deadlines.", icon: "play_circle" },
  { tag: "Premium", title: "Geofencing Setup", description: "Define work zones and radius limits for location-based clock-in.", icon: "location_on" },
  { tag: "Premium", title: "Biometric Auth", description: "Enable Face ID / Touch ID verification for staff sign-in.", icon: "fingerprint" },
  { tag: "Administration", title: "Leave Management", description: "Configure leave types, approvals, and team visibility.", icon: "event_available" },
  { tag: "Reports", title: "Exporting Data", description: "Generate CSV attendance reports and filter by date range.", icon: "file_download" },
  { tag: "Security", title: "Audit Log", description: "Track admin actions, manual entries, and role changes.", icon: "history" },
];

export default function ResourcesPage() {
  return (
    <MarketingPage>
      <MarketingHero
        eyebrow="Resources"
        title={
          <>
            Everything you need <br />
            <span style={{ color: "#ac3400" }}>to get started</span>
          </>
        }
        description="Guides, documentation, and support to help you and your team get the most out of Logasiko."
        centered
      >
        <div className="relative max-w-xl mx-auto w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px]" style={{ color: "#707974" }}>
            search
          </span>
          <input
            type="text"
            placeholder="Search resources…"
            className="w-full pl-12 pr-6 py-4 rounded-2xl border text-sm outline-none"
            style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#ffffff", color: "#181d1b" }}
          />
        </div>
      </MarketingHero>

      <MarketingSection variant="muted">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <MarketingCard key={link.title} className="p-6">
              <MarketingIconBox icon={link.icon} variant="mint" />
              <h3 className="text-base font-bold mt-4 mb-2" style={{ color: "#003527" }}>
                {link.title}
              </h3>
              <p className="text-sm" style={{ color: "#707974" }}>
                {link.description}
              </p>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection variant="white">
        <MarketingHeading title="Popular guides" description="Step-by-step documentation for admins and staff." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r) => (
            <MarketingCard key={r.title}>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-4"
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  backgroundColor: r.tag === "Premium" ? "#ffdbd0" : "#b0f0d6",
                  color: r.tag === "Premium" ? "#832600" : "#0b513d",
                }}
              >
                {r.tag}
              </span>
              <MarketingIconBox icon={r.icon} variant="dark" />
              <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: "#003527" }}>
                {r.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: "#404944" }}>
                {r.description}
              </p>
              <button type="button" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: "#ac3400" }}>
                Read guide
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection>
        <MarketingHeading title="Need help?" description="Our team is here when you need us." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Email Support", description: "Get help from our team within one business day.", icon: "mail", action: "support@logasiko.com" },
            { title: "Documentation", description: "Browse guides for admins, staff, and super admins.", icon: "menu_book", action: "Browse docs" },
            { title: "Community", description: "Connect with other Logasiko admins and share tips.", icon: "forum", action: "Join forum" },
          ].map((s) => (
            <MarketingCard key={s.title} className="text-center flex flex-col items-center">
              <MarketingIconBox icon={s.icon} variant="terracotta" />
              <h3 className="text-lg font-bold mt-5 mb-2" style={{ color: "#003527" }}>
                {s.title}
              </h3>
              <p className="text-sm mb-6" style={{ color: "#707974" }}>
                {s.description}
              </p>
              <MarketingButton variant="secondary">{s.action}</MarketingButton>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <LandingCta title="Ready to get started?" subtitle="Start your free trial and explore Logasiko today." />
    </MarketingPage>
  );
}
