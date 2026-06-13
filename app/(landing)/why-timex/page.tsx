import Image from "next/image";
import { LandingCta } from "@/components/landing/LandingCta";
import { CheckIcon, IconWrapper, StarRating, XIcon } from "@/components/landing/MarketingIcons";

const achievements = [
  { value: "99.9%", label: "Accuracy Rate" },
  { value: "500+", label: "Enterprise Clients" },
  { value: "30%", label: "Cost Reduction" },
  { value: "24/7", label: "Support" },
];

const features = [
  {
    title: "Advanced AI Technology",
    description: "Our proprietary AI algorithms ensure 99.9% accuracy in time tracking and attendance verification.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    bullets: ["Machine Learning Powered", "Real-time Processing", "Continuous Learning"],
  },
  {
    title: "Enterprise-Grade Security",
    description: "Bank-level encryption and compliance with international security standards.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    bullets: ["256-bit Encryption", "GDPR Compliant", "Regular Security Audits"],
  },
  {
    title: "Unlimited Scalability",
    description: "Grow your business without worrying about system limitations or performance.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    bullets: ["Cloud Infrastructure", "Auto-scaling", "Global Availability"],
  },
];

const comparison = [
  { feature: "AI-Powered Accuracy", timex: "check", traditional: "x" },
  { feature: "Real-time Analytics", timex: "check", traditional: "Limited" },
  { feature: "GPS Verification", timex: "check", traditional: "Additional Cost" },
  { feature: "Mobile Access", timex: "check", traditional: "Limited" },
  { feature: "24/7 Support", timex: "check", traditional: "Business Hours Only" },
];

const testimonials = [
  { quote: "TimeX has completely transformed how we manage our workforce. The AI-powered features and real-time analytics have given us unprecedented visibility and control.", name: "Robert Chen", role: "CEO, TechCorp Inc." },
  { quote: "The accuracy and reliability of TimeX's attendance tracking have significantly reduced our administrative overhead. Their customer support is exceptional.", name: "Sarah Williams", role: "HR Director, Global Manufacturing" },
  { quote: "Implementing TimeX was seamless, and the ROI was immediate. Their mobile app has made it incredibly easy for our employees to manage their time.", name: "Michael Thompson", role: "Operations Manager, Retail Chain" },
];

export default function WhyTimeXPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Why Choose <br />
                <span className="text-primary">TimeX?</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover why TimeX is the preferred choice for modern workforce management, trusted by industry leaders worldwide.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {achievements.map((a) => (
                  <div key={a.label} className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-3xl font-bold text-primary">{a.value}</p>
                    <p className="text-gray-600">{a.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <Image src="/hero_art.svg" alt="Why TimeX" width={600} height={400} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Sets Us Apart</h2>
            <p className="text-xl text-gray-600">TimeX combines cutting-edge technology with user-friendly design to deliver unmatched value.</p>
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
                <ul className="mt-4 space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center text-gray-600">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">TimeX vs. Traditional Solutions</h2>
            <p className="text-xl text-gray-600">See how TimeX outperforms traditional workforce management solutions.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-6 text-left">Features</th>
                  <th className="p-6 text-center text-primary">TimeX</th>
                  <th className="p-6 text-center text-gray-500">Traditional Solutions</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b last:border-0">
                    <td className="p-6">{row.feature}</td>
                    <td className="p-6 text-center">
                      {row.timex === "check" ? <CheckIcon className="w-6 h-6 text-green-500 mx-auto" /> : row.timex}
                    </td>
                    <td className="p-6 text-center">
                      {row.traditional === "x" ? <XIcon /> : row.traditional}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Hear from industry leaders who have transformed their operations with TimeX.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="feature-card">
                <div className="mb-6">
                  <StarRating />
                </div>
                <blockquote className="text-gray-600 mb-6">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="flex items-center">
                  <Image src="/review.svg" alt={t.name} width={48} height={48} className="rounded-full mr-4" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-gray-600">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingCta
        title="Ready to Experience the TimeX Difference?"
        subtitle="Join thousands of companies already optimizing their workforce with TimeX"
        secondaryLabel="Schedule Demo"
      />
    </div>
  );
}
