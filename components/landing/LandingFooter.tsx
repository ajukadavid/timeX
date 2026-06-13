import Link from "next/link";
import Image from "next/image";

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="TimeX" width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold">TimeX</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering organizations worldwide with intelligent workforce management solutions.
            </p>
          </div>
          {[
            { title: "Product", links: [{ label: "Platform", href: "/platform" }, { label: "Pricing", href: "/pricing" }, { label: "Use Cases", href: "/use-cases" }] },
            { title: "Company", links: [{ label: "Why TimeX", href: "/why-timex" }, { label: "Resources", href: "/resources" }] },
            { title: "Support", links: [{ label: "Help Center", href: "/resources" }, { label: "Documentation", href: "/resources" }] },
          ].map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <div className="flex flex-col space-y-3">
                {section.links.map((l) => (
                  <Link key={l.label} href={l.href} className="text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2026 TimeX. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
