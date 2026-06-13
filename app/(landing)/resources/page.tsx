import { LandingCta } from "@/components/landing/LandingCta";
import { IconWrapper } from "@/components/landing/MarketingIcons";

const quickLinks = [
  { title: "Getting Started", description: "Quick start guides and tutorials", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Documentation", description: "Detailed feature documentation", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { title: "API Reference", description: "API documentation and examples", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { title: "Help Center", description: "FAQs and troubleshooting", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
];

const resources = [
  { tag: "Getting Started", title: "Quick Start Guide", description: "Learn how to set up TimeX for your organization in under 10 minutes." },
  { tag: "Mobile", title: "Mobile App Guide", description: "Everything you need to know about using the TimeX mobile app." },
  { tag: "Administration", title: "Admin Guide", description: "Comprehensive guide for system administrators and HR managers." },
  { tag: "Development", title: "API Documentation", description: "Technical documentation for developers integrating with TimeX." },
  { tag: "Best Practices", title: "Best Practices Guide", description: "Learn how to optimize your workforce management with TimeX." },
  { tag: "Security", title: "Security Guide", description: "Understanding TimeX's security features and best practices." },
];

const videos = [
  { title: "Getting Started with TimeX", description: "Learn the basics of TimeX in this introductory video." },
  { title: "Advanced Features Tutorial", description: "Deep dive into TimeX's advanced features and capabilities." },
  { title: "Admin Dashboard Tutorial", description: "Learn how to effectively manage your organization using the admin dashboard." },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Resources & <br />
              <span className="text-primary">Support</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to get the most out of TimeX. From quick start guides to in-depth documentation.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full px-6 py-4 rounded-full border focus:ring-2 focus:ring-primary focus:border-primary pl-12"
              />
              <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <div key={link.title} className="quick-link-card">
                <IconWrapper>
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                </IconWrapper>
                <h3 className="text-lg font-semibold mb-2 mt-4">{link.title}</h3>
                <p className="text-gray-600">{link.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Popular Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((r) => (
              <div key={r.title} className="resource-card">
                <div className="mb-6">
                  <span className="text-sm font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">{r.tag}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{r.title}</h3>
                <p className="text-gray-600 mb-4">{r.description}</p>
                <button type="button" className="text-primary font-semibold hover:underline">Read More →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((v) => (
              <div key={v.title} className="video-card">
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Get Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Email Support", description: "Get help from our support team via email", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { title: "Live Chat", description: "Chat with our support team in real-time", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
              { title: "Phone Support", description: "Get immediate assistance over the phone", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
            ].map((s) => (
              <div key={s.title} className="support-card text-center">
                <IconWrapper>
                  <svg className="w-8 h-8 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </IconWrapper>
                <h3 className="text-xl font-semibold mb-4 mt-6">{s.title}</h3>
                <p className="text-gray-600 mb-4">{s.description}</p>
                <button type="button" className="btn-primary">Contact Support</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl text-gray-600 mb-8">
              Connect with other TimeX users, share best practices, and get help from the community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button type="button" className="btn-primary">Join Forum</button>
              <button type="button" className="btn-outline-primary">View Discussions</button>
            </div>
          </div>
        </div>
      </section>

      <LandingCta title="Ready to Get Started?" subtitle="Start your free trial and explore TimeX today" />
    </div>
  );
}
