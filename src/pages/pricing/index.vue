<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Simple, Transparent <br/>
            <span class="text-primary">Pricing</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your business. All plans include core features with flexible scaling options.
          </p>
          <!-- Billing Toggle -->
          <div class="flex items-center justify-center gap-4 mb-12">
            <span class="text-gray-600">Monthly</span>
            <button class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary">
              <span class="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
            </button>
            <span class="text-gray-600">Annual <span class="text-primary">(Save 20%)</span></span>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Tiers -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Starter Plan -->
          <div class="pricing-card">
            <div class="p-8">
              <h3 class="text-2xl font-semibold mb-4">Starter</h3>
              <p class="text-gray-600 mb-6">Perfect for small teams getting started</p>
              <div class="mb-6">
                <span class="text-4xl font-bold">$9</span>
                <span class="text-gray-600">/user/month</span>
              </div>
              <button class="btn-outline-primary w-full mb-8">Start Free Trial</button>
              <ul class="space-y-4">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 10 employees
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic time tracking
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Mobile app access
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Email support
                </li>
              </ul>
            </div>
          </div>

          <!-- Professional Plan -->
          <div class="pricing-card-featured">
            <div class="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
              Most Popular
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-semibold mb-4">Professional</h3>
              <p class="text-gray-600 mb-6">Ideal for growing businesses</p>
              <div class="mb-6">
                <span class="text-4xl font-bold">$19</span>
                <span class="text-gray-600">/user/month</span>
              </div>
              <button class="btn-primary w-full mb-8">Start Free Trial</button>
              <ul class="space-y-4">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 50 employees
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  AI-powered time tracking
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  GPS verification
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time analytics
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>
          </div>

          <!-- Enterprise Plan -->
          <div class="pricing-card">
            <div class="p-8">
              <h3 class="text-2xl font-semibold mb-4">Enterprise</h3>
              <p class="text-gray-600 mb-6">For large organizations</p>
              <div class="mb-6">
                <span class="text-4xl font-bold">Custom</span>
              </div>
              <button class="btn-outline-primary w-full mb-8">Contact Sales</button>
              <ul class="space-y-4">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited employees
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Custom integrations
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Dedicated account manager
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 premium support
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Custom SLA
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Comparison -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-16">Compare Plans in Detail</h2>
        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded-xl shadow-sm">
            <thead>
              <tr class="border-b">
                <th class="p-6 text-left">Features</th>
                <th class="p-6 text-center">Starter</th>
                <th class="p-6 text-center text-primary">Professional</th>
                <th class="p-6 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <!-- Time Tracking -->
              <tr class="border-b">
                <td class="p-6 font-semibold">Time Tracking</td>
                <td class="p-6 text-center">Basic</td>
                <td class="p-6 text-center">AI-Powered</td>
                <td class="p-6 text-center">AI-Powered + Custom</td>
              </tr>
              <!-- GPS Verification -->
              <tr class="border-b">
                <td class="p-6 font-semibold">GPS Verification</td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              <!-- Analytics -->
              <tr class="border-b">
                <td class="p-6 font-semibold">Analytics</td>
                <td class="p-6 text-center">Basic Reports</td>
                <td class="p-6 text-center">Advanced Analytics</td>
                <td class="p-6 text-center">Custom Reports</td>
              </tr>
              <!-- Mobile Access -->
              <tr class="border-b">
                <td class="p-6 font-semibold">Mobile Access</td>
                <td class="p-6 text-center">Limited</td>
                <td class="p-6 text-center">Full Access</td>
                <td class="p-6 text-center">Full Access + Custom Apps</td>
              </tr>
              <!-- Support -->
              <tr class="border-b">
                <td class="p-6 font-semibold">Support</td>
                <td class="p-6 text-center">Email</td>
                <td class="p-6 text-center">Priority</td>
                <td class="p-6 text-center">24/7 Premium</td>
              </tr>
              <!-- API Access -->
              <tr>
                <td class="p-6 font-semibold">API Access</td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td class="p-6 text-center">Limited</td>
                <td class="p-6 text-center">Full Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- FAQ Item 1 -->
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-4">Can I change plans later?</h3>
            <p class="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          <!-- FAQ Item 2 -->
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-4">Is there a free trial?</h3>
            <p class="text-gray-600">
              Yes, we offer a 14-day free trial for all plans. No credit card required.
            </p>
          </div>
          <!-- FAQ Item 3 -->
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-4">What payment methods do you accept?</h3>
            <p class="text-gray-600">
              We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
            </p>
          </div>
          <!-- FAQ Item 4 -->
          <div class="faq-item">
            <h3 class="text-xl font-semibold mb-4">Can I cancel anytime?</h3>
            <p class="text-gray-600">
              Yes, you can cancel your subscription at any time. No long-term contracts required.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p class="text-xl mb-8 opacity-90">Join thousands of companies already using TimeX</p>
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
.pricing-card {
  @apply bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 relative;
}

.pricing-card-featured {
  @apply bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative border-2 border-primary;
}

.faq-item {
  @apply bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300;
}

.btn-primary {
  @apply px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-colors duration-300;
}

.btn-outline-primary {
  @apply px-8 py-3 bg-transparent text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-300;
}

.btn-white {
  @apply px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300;
}

.btn-outline-white {
  @apply px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300;
}
</style> 