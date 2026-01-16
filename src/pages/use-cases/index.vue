<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Success Stories from <br/>
            <span class="text-primary">Industry Leaders</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Discover how companies across different industries are transforming their workforce management with TimeX.
          </p>
        </div>
      </div>
    </section>

    <!-- Industry Cases -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Manufacturing -->
          <div class="case-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Manufacturing Excellence</h3>
            <p class="text-gray-600 mb-6">
              See how leading manufacturers improved productivity by 35% with automated time tracking and shift management.
            </p>
            <div class="stats grid grid-cols-2 gap-4 mb-6">
              <div class="stat p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold text-primary">35%</p>
                <p class="text-sm text-gray-600">Productivity Boost</p>
              </div>
              <div class="stat p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold text-primary">$2.5M</p>
                <p class="text-sm text-gray-600">Annual Savings</p>
              </div>
            </div>
            <button class="text-primary font-semibold hover:underline">Read Case Study →</button>
          </div>

          <!-- Healthcare -->
          <div class="case-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Healthcare Innovation</h3>
            <p class="text-gray-600 mb-6">
              Learn how hospitals reduced administrative overhead by 45% while ensuring accurate staff scheduling.
            </p>
            <div class="stats grid grid-cols-2 gap-4 mb-6">
              <div class="stat p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold text-primary">45%</p>
                <p class="text-sm text-gray-600">Admin Reduction</p>
              </div>
              <div class="stat p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold text-primary">99.9%</p>
                <p class="text-sm text-gray-600">Scheduling Accuracy</p>
              </div>
            </div>
            <button class="text-primary font-semibold hover:underline">Read Case Study →</button>
          </div>

          <!-- Retail -->
          <div class="case-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Retail Revolution</h3>
            <p class="text-gray-600 mb-6">
              Discover how retail chains optimized staffing costs and improved customer service with real-time analytics.
            </p>
            <div class="stats grid grid-cols-2 gap-4 mb-6">
              <div class="stat p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold text-primary">28%</p>
                <p class="text-sm text-gray-600">Cost Reduction</p>
              </div>
              <div class="stat p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold text-primary">4.8★</p>
                <p class="text-sm text-gray-600">Customer Rating</p>
              </div>
            </div>
            <button class="text-primary font-semibold hover:underline">Read Case Study →</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Customer Success Stories</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Story 1 -->
          <div class="success-story bg-white rounded-xl p-8 shadow-sm">
            <div class="flex items-start gap-4 mb-6">
              <img src="/review.svg" alt="Company Logo" class="w-16 h-16 rounded-lg"/>
              <div>
                <h3 class="text-xl font-semibold">Global Manufacturing Co.</h3>
                <p class="text-gray-600">Manufacturing Industry</p>
              </div>
            </div>
            <blockquote class="text-gray-600 mb-6">
              "TimeX has revolutionized how we manage our workforce. The AI-powered time tracking and real-time analytics have given us unprecedented visibility into our operations."
            </blockquote>
            <div class="flex items-center gap-4">
              <img src="/review.svg" alt="CEO Portrait" class="w-12 h-12 rounded-full"/>
              <div>
                <p class="font-semibold">Sarah Johnson</p>
                <p class="text-gray-600">Chief Operations Officer</p>
              </div>
            </div>
          </div>

          <!-- Story 2 -->
          <div class="success-story bg-white rounded-xl p-8 shadow-sm">
            <div class="flex items-start gap-4 mb-6">
              <img src="/review.svg" alt="Company Logo" class="w-16 h-16 rounded-lg"/>
              <div>
                <h3 class="text-xl font-semibold">City General Hospital</h3>
                <p class="text-gray-600">Healthcare Industry</p>
              </div>
            </div>
            <blockquote class="text-gray-600 mb-6">
              "The automated scheduling and compliance features have been a game-changer for our hospital. We've significantly reduced administrative overhead while improving accuracy."
            </blockquote>
            <div class="flex items-center gap-4">
              <img src="/review.svg" alt="CEO Portrait" class="w-12 h-12 rounded-full"/>
              <div>
                <p class="font-semibold">Dr. Michael Chen</p>
                <p class="text-gray-600">Hospital Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ROI Calculator -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Calculate Your ROI</h2>
          <p class="text-xl text-gray-600 mb-12">
            See how much your organization can save with TimeX's automated workforce management solution.
          </p>
          <div class="bg-gray-50 rounded-xl p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div class="form-group">
                <label class="block text-gray-700 mb-2">Number of Employees</label>
                <input type="number" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"/>
              </div>
              <div class="form-group">
                <label class="block text-gray-700 mb-2">Average Hourly Rate</label>
                <input type="number" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"/>
              </div>
            </div>
            <button class="btn-primary">Calculate Savings</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Workforce Management?</h2>
        <p class="text-xl mb-8 opacity-90">Join thousands of companies already using TimeX to optimize their operations</p>
        <div class="flex flex-wrap justify-center gap-4">
          <button class="btn-white">Start Free Trial</button>
          <button class="btn-outline-white">Contact Sales</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'landing'
})
</script>

<style scoped>
@reference "tailwindcss";

.case-card {
  @apply p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300;
}

.success-story {
  @apply hover:shadow-md transition-shadow duration-300;
}

.btn-primary {
  @apply px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors duration-300;
  background-color: var(--color-primary-500);
}

.btn-white {
  @apply px-8 py-3 bg-white rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300;
  color: var(--color-primary-500);
}

.btn-outline-white {
  @apply px-8 py-3 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white transition-colors duration-300;
  color: white;
}

.btn-outline-white:hover {
  color: var(--color-primary-500);
}

.icon-wrapper {
  @apply p-3 rounded-lg inline-block;
  background-color: color-mix(in srgb, var(--color-primary-500) 10%, transparent);
}
</style> 