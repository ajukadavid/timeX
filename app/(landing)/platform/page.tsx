import Image from "next/image";
import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { CheckIcon, IconWrapper } from "@/components/landing/MarketingIcons";

const features = [
  { title: "AI-Powered Time Tracking", description: "Automatic time logging with 99.9% accuracy using advanced AI algorithms.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "GPS Verification", description: "Ensure attendance authenticity with precise location tracking and geofencing.", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
  { title: "Real-time Analytics", description: "Make data-driven decisions with comprehensive attendance insights and reports.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { title: "Automated Workflows", description: "Streamline HR processes with customizable approval flows and notifications.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { title: "Mobile Access", description: "Manage attendance on-the-go with our powerful mobile application.", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { title: "Compliance Management", description: "Stay compliant with automated time tracking and attendance policies.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

const integrations = [
  { src: "/slack-logo.svg", alt: "Slack" },
  { src: "/microsoft-teams-logo.svg", alt: "Microsoft Teams" },
  { src: "/workday-logo.svg", alt: "Workday" },
  { src: "/bamboo-hr-logo.svg", alt: "BambooHR" },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Revolutionize Your <br />
                <span className="text-primary">Workforce Management</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                TimeX combines AI-powered time tracking, GPS verification, and real-time analytics to give you unparalleled control over attendance management.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-primary">Start Free Trial</Link>
                <button type="button" className="btn-secondary">Schedule Demo</button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <Image src="/hero_art.svg" alt="Platform Overview" width={600} height={400} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Teams</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your workforce effectively</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <IconWrapper>
                  <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                </IconWrapper>
                <h3 className="text-xl font-semibold mb-3 mt-6">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Seamless Integration with Your Favorite Tools</h2>
              <p className="text-xl text-gray-600 mb-8">
                TimeX works perfectly with your existing HR stack. Connect with popular payroll, HRIS, and communication tools.
              </p>
              <ul className="space-y-4">
                {["Automatic data sync", "Real-time updates", "Secure data transfer"].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckIcon className="w-6 h-6 text-green-500 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="grid grid-cols-2 gap-8">
                {integrations.map((logo) => (
                  <div key={logo.alt} className="integration-logo">
                    <Image src={logo.src} alt={logo.alt} width={120} height={48} className="h-12 w-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingCta />
    </div>
  );
}
