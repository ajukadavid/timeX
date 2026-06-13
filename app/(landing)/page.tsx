import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/landing/HeroSection";

const features = [
  { icon: "user-group", title: "Smart User Management", description: "Intuitive dashboard to manage your entire workforce with role-based permissions and automated workflows.", highlight: "Save 5+ hours weekly" },
  { icon: "envelope", title: "Automated Invitations", description: "Streamlined onboarding with smart sign-in invitations and customizable welcome sequences.", highlight: "90% faster onboarding" },
  { icon: "clock", title: "Precision Time Tracking", description: "AI-powered automatic time logging with GPS verification and real-time attendance monitoring.", highlight: "99.9% accuracy" },
  { icon: "bell-alert", title: "Smart Notifications", description: "Intelligent alerts for attendance exceptions with customizable notification preferences.", highlight: "Instant alerts" },
];

const featureIcons: Record<string, string> = {
  "user-group": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  envelope: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  "bell-alert": "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
};

const benefits = [
  { metric: "40%", title: "Productivity Increase", description: "Teams report significant productivity gains within the first month" },
  { metric: "15hrs", title: "Time Saved Weekly", description: "Reduce administrative overhead with automated processes" },
  { metric: "$50K+", title: "Annual Savings", description: "Average cost savings per organization using TimeX" },
  { metric: "98%", title: "Employee Satisfaction", description: "Employees love the simplified time management experience" },
];

const testimonials = [
  { name: "Sarah Johnson", role: "HR Director at TechCorp", quote: "TimeX revolutionized our workforce management. We've seen a 40% increase in productivity since implementation." },
  { name: "Mike Chen", role: "Operations Manager at StartupX", quote: "The automated time tracking feature alone saved us hundreds of hours in manual work. Incredible ROI." },
  { name: "Emma Rodriguez", role: "CEO at RemoteFirst", quote: "Managing our global team across 12 time zones is now effortless. TimeX is a game-changer." },
];

const faqs = [
  { question: "How quickly can we get started with TimeX?", answer: "Most organizations are up and running within 24 hours. Our onboarding team provides personalized setup assistance." },
  { question: "Is TimeX suitable for remote teams?", answer: "Absolutely! TimeX is designed specifically for modern workforces, including remote, hybrid, and distributed teams across multiple time zones." },
  { question: "What integrations are available?", answer: "TimeX integrates with 50+ popular tools including Slack, Microsoft Teams, QuickBooks, and major payroll systems." },
  { question: "How secure is our data?", answer: "We use enterprise-grade security with SOC 2 compliance, end-to-end encryption, and regular security audits." },
];

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <HeroSection />

      <div className="py-16 md:py-20 px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why teams choose TimeX</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Join thousands of companies that have transformed their workforce management</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl font-bold text-primary mb-2">{b.metric}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 md:py-20 px-6 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Powerful features for every team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need to manage your workforce efficiently, from day one to scale</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={featureIcons[f.icon]} />
                  </svg>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">{f.title}</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full shrink-0">{f.highlight}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 md:py-20 px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Loved by teams worldwide</h2>
            <p className="text-gray-600 text-lg">Don&apos;t just take our word for it</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center space-x-3">
                  <Image src="/about_us.jpg" alt={t.name} width={48} height={48} className="rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-gray-600 text-sm">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-blue-600 py-16 md:py-20 px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight">Ready to transform your workforce management?</h2>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">Join thousands of companies using TimeX to boost productivity and streamline operations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-primary hover:bg-gray-50 text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center">
              Start Free Trial
            </Link>
            <button type="button" className="border-2 border-white text-white hover:bg-white/10 text-lg font-semibold px-8 py-4 rounded-xl transition-all">
              Schedule Demo
            </button>
          </div>
          <p className="text-white/80 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </div>

      <div className="py-16 md:py-20 px-6 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="border border-gray-200 rounded-xl p-6 hover:border-primary/20 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
