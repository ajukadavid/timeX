<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center -mx-4">
          <div class="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Revolutionize Your <br/>
              <span class="text-primary">Workforce Management</span>
            </h1>
            <p class="text-xl text-gray-600 mb-8">
              TimeX combines AI-powered time tracking, GPS verification, and real-time analytics to give you unparalleled control over attendance management.
            </p>
            <div class="flex flex-wrap gap-4">
              <button class="btn-primary">Start Free Trial</button>
              <button class="btn-secondary">Schedule Demo</button>
            </div>
          </div>
          <div class="w-full lg:w-1/2 px-4">
            <div class="relative">
              <img src="/hero_art.svg" alt="Platform Overview" class="w-full h-auto"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Teams</h2>
          <p class="text-xl text-gray-600">Everything you need to manage your workforce effectively</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- AI Time Tracking -->
          <div class="feature-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">AI-Powered Time Tracking</h3>
            <p class="text-gray-600">Automatic time logging with 99.9% accuracy using advanced AI algorithms.</p>
          </div>

          <!-- GPS Verification -->
          <div class="feature-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">GPS Verification</h3>
            <p class="text-gray-600">Ensure attendance authenticity with precise location tracking and geofencing.</p>
          </div>

          <!-- Real-time Analytics -->
          <div class="feature-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Real-time Analytics</h3>
            <p class="text-gray-600">Make data-driven decisions with comprehensive attendance insights and reports.</p>
          </div>

          <!-- Automated Workflows -->
          <div class="feature-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Automated Workflows</h3>
            <p class="text-gray-600">Streamline HR processes with customizable approval flows and notifications.</p>
          </div>

          <!-- Mobile Access -->
          <div class="feature-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Mobile Access</h3>
            <p class="text-gray-600">Manage attendance on-the-go with our powerful mobile application.</p>
          </div>

          <!-- Compliance Management -->
          <div class="feature-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Compliance Management</h3>
            <p class="text-gray-600">Stay compliant with automated time tracking and attendance policies.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Integration Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center -mx-4">
          <div class="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Seamless Integration with Your Favorite Tools</h2>
            <p class="text-xl text-gray-600 mb-8">
              TimeX works perfectly with your existing HR stack. Connect with popular payroll, HRIS, and communication tools.
            </p>
            <ul class="space-y-4">
              <li class="flex items-center">
                <svg class="w-6 h-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700">Automatic data sync</span>
              </li>
              <li class="flex items-center">
                <svg class="w-6 h-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700">Real-time updates</span>
              </li>
              <li class="flex items-center">
                <svg class="w-6 h-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700">Secure data transfer</span>
              </li>
            </ul>
          </div>
          <div class="w-full lg:w-1/2 px-4">
            <div class="grid grid-cols-2 gap-8">
              <div class="integration-logo">
                <img src="~/assets/slack-logo.svg" alt="Slack" class="h-12"/>
              </div>
              <div class="integration-logo">
                <img src="~/assets/microsoft-teams-logo.svg" alt="Microsoft Teams" class="h-12"/>
              </div>
              <div class="integration-logo">
                <img src="~/assets/workday-logo.svg" alt="Workday" class="h-12"/>
              </div>
              <div class="integration-logo">
                <img src="~/assets/bamboo-hr-logo.svg" alt="BambooHR" class="h-12"/>
              </div>
            </div>
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

.feature-card {
  @apply p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300;
}

.integration-logo {
  @apply flex items-center justify-center p-6 bg-white rounded-lg shadow-sm;
}

.btn-primary {
  @apply px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors duration-300;
  background-color: var(--color-primary-500);
}

.btn-secondary {
  @apply px-8 py-3 bg-white border-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300;
  color: var(--color-primary-500);
  border-color: var(--color-primary-500);
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