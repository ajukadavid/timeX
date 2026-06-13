import Image from "next/image";
import { LandingCta } from "@/components/landing/LandingCta";
import { IconWrapper } from "@/components/landing/MarketingIcons";

const cases = [
  {
    title: "Manufacturing Excellence",
    description: "See how leading manufacturers improved productivity by 35% with automated time tracking and shift management.",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    stats: [{ value: "35%", label: "Productivity Boost" }, { value: "$2.5M", label: "Annual Savings" }],
  },
  {
    title: "Healthcare Innovation",
    description: "Learn how hospitals reduced administrative overhead by 45% while ensuring accurate staff scheduling.",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    stats: [{ value: "45%", label: "Admin Reduction" }, { value: "99.9%", label: "Scheduling Accuracy" }],
  },
  {
    title: "Retail Revolution",
    description: "Discover how retail chains optimized staffing costs and improved customer service with real-time analytics.",
    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    stats: [{ value: "28%", label: "Cost Reduction" }, { value: "4.8★", label: "Customer Rating" }],
  },
];

const stories = [
  {
    company: "Global Manufacturing Co.",
    industry: "Manufacturing Industry",
    quote: "TimeX has revolutionized how we manage our workforce. The AI-powered time tracking and real-time analytics have given us unprecedented visibility into our operations.",
    name: "Sarah Johnson",
    role: "Chief Operations Officer",
  },
  {
    company: "City General Hospital",
    industry: "Healthcare Industry",
    quote: "The automated scheduling and compliance features have been a game-changer for our hospital. We've significantly reduced administrative overhead while improving accuracy.",
    name: "Dr. Michael Chen",
    role: "Hospital Administrator",
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Success Stories from <br />
              <span className="text-primary">Industry Leaders</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover how companies across different industries are transforming their workforce management with TimeX.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((c) => (
              <div key={c.title} className="case-card">
                <IconWrapper>
                  <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                  </svg>
                </IconWrapper>
                <h3 className="text-xl font-semibold mb-3 mt-6">{c.title}</h3>
                <p className="text-gray-600 mb-6">{c.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {c.stats.map((s) => (
                    <div key={s.label} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{s.value}</p>
                      <p className="text-sm text-gray-600">{s.label}</p>
                    </div>
                  ))}
                </div>
                <button type="button" className="text-primary font-semibold hover:underline">Read Case Study →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Customer Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((s) => (
              <div key={s.company} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-6">
                  <Image src="/review.svg" alt="Company Logo" width={64} height={64} className="rounded-lg" />
                  <div>
                    <h3 className="text-xl font-semibold">{s.company}</h3>
                    <p className="text-gray-600">{s.industry}</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 mb-6">&ldquo;{s.quote}&rdquo;</blockquote>
                <div className="flex items-center gap-4">
                  <Image src="/review.svg" alt={s.name} width={48} height={48} className="rounded-full" />
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-gray-600">{s.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Calculate Your ROI</h2>
            <p className="text-xl text-gray-600 mb-12">
              See how much your organization can save with TimeX&apos;s automated workforce management solution.
            </p>
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-gray-700 mb-2 text-left">Number of Employees</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-left">Average Hourly Rate</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <button type="button" className="btn-primary">Calculate Savings</button>
            </div>
          </div>
        </div>
      </section>

      <LandingCta />
    </div>
  );
}
