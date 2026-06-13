"use client";

import Link from "next/link";
import Image from "next/image";
import { ClientOnly } from "@/components/ClientOnly";
import { HeroTypewriter } from "@/components/landing/HeroTypewriter";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24 px-6 md:px-8">
      <ClientOnly>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" />
        </div>
      </ClientOnly>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <Image
                  key={i}
                  src="/about_us.jpg"
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white"
                />
              ))}
            </div>
            <span>Trusted by 2,000+ companies worldwide</span>
          </div>
          <h1 className="text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Manage Your Staff Processes More <br />
            <HeroTypewriter />
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed">
            The all-in-one HR platform that transforms workforce management with AI-powered automation, real-time insights, and seamless integrations.
          </p>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="bg-primary hover:bg-primary/90 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-center"
              >
                Start Free Trial
              </Link>
              <button
                type="button"
                className="border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary text-lg font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Demo
              </button>
            </div>
            <p className="text-sm text-gray-500">
              ✓ No credit card required ✓ 14-day free trial ✓ Setup in 5 minutes
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
            <Image
              src="/hero_art.svg"
              alt="TimeX Dashboard"
              width={600}
              height={400}
              className="w-full h-auto"
              priority
            />
            <ClientOnly>
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-bounce">
                ✓ Live
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-white text-xs px-3 py-1 rounded-full animate-pulse">
                Real-time sync
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  );
}
