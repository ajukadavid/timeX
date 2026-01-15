<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Resources & <br/>
            <span class="text-primary">Support</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Everything you need to get the most out of TimeX. From quick start guides to in-depth documentation.
          </p>
          <!-- Search Bar -->
          <div class="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search resources..."
              class="w-full px-6 py-4 rounded-full border focus:ring-2 focus:ring-primary focus:border-primary pl-12"
            />
            <svg
              class="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Getting Started -->
          <div class="quick-link-card">
            <div class="icon-wrapper mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Getting Started</h3>
            <p class="text-gray-600">Quick start guides and tutorials</p>
          </div>
          <!-- Documentation -->
          <div class="quick-link-card">
            <div class="icon-wrapper mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Documentation</h3>
            <p class="text-gray-600">Detailed feature documentation</p>
          </div>
          <!-- API Reference -->
          <div class="quick-link-card">
            <div class="icon-wrapper mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">API Reference</h3>
            <p class="text-gray-600">API documentation and examples</p>
          </div>
          <!-- Help Center -->
          <div class="quick-link-card">
            <div class="icon-wrapper mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Help Center</h3>
            <p class="text-gray-600">FAQs and troubleshooting</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentation Grid -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12">Popular Resources</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Getting Started Guide -->
          <div class="resource-card">
            <div class="mb-6">
              <span class="text-sm font-semibold text-primary px-3 py-1 bg-primary bg-opacity-10 rounded-full">
                Getting Started
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-3">Quick Start Guide</h3>
            <p class="text-gray-600 mb-4">
              Learn how to set up TimeX for your organization in under 10 minutes.
            </p>
            <a href="#" class="text-primary font-semibold hover:underline">Read More →</a>
          </div>

          <!-- Mobile App Guide -->
          <div class="resource-card">
            <div class="mb-6">
              <span class="text-sm font-semibold text-primary px-3 py-1 bg-primary bg-opacity-10 rounded-full">
                Mobile
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-3">Mobile App Guide</h3>
            <p class="text-gray-600 mb-4">
              Everything you need to know about using the TimeX mobile app.
            </p>
            <a href="#" class="text-primary font-semibold hover:underline">Read More →</a>
          </div>

          <!-- Admin Guide -->
          <div class="resource-card">
            <div class="mb-6">
              <span class="text-sm font-semibold text-primary px-3 py-1 bg-primary bg-opacity-10 rounded-full">
                Administration
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-3">Admin Guide</h3>
            <p class="text-gray-600 mb-4">
              Comprehensive guide for system administrators and HR managers.
            </p>
            <a href="#" class="text-primary font-semibold hover:underline">Read More →</a>
          </div>

          <!-- API Documentation -->
          <div class="resource-card">
            <div class="mb-6">
              <span class="text-sm font-semibold text-primary px-3 py-1 bg-primary bg-opacity-10 rounded-full">
                Development
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-3">API Documentation</h3>
            <p class="text-gray-600 mb-4">
              Technical documentation for developers integrating with TimeX.
            </p>
            <a href="#" class="text-primary font-semibold hover:underline">Read More →</a>
          </div>

          <!-- Best Practices -->
          <div class="resource-card">
            <div class="mb-6">
              <span class="text-sm font-semibold text-primary px-3 py-1 bg-primary bg-opacity-10 rounded-full">
                Best Practices
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-3">Best Practices Guide</h3>
            <p class="text-gray-600 mb-4">
              Learn how to optimize your workforce management with TimeX.
            </p>
            <a href="#" class="text-primary font-semibold hover:underline">Read More →</a>
          </div>

          <!-- Security Guide -->
          <div class="resource-card">
            <div class="mb-6">
              <span class="text-sm font-semibold text-primary px-3 py-1 bg-primary bg-opacity-10 rounded-full">
                Security
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-3">Security Guide</h3>
            <p class="text-gray-600 mb-4">
              Understanding TimeX's security features and best practices.
            </p>
            <a href="#" class="text-primary font-semibold hover:underline">Read More →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Tutorials -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12">Video Tutorials</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Tutorial 1 -->
          <div class="video-card">
            <div class="aspect-w-16 aspect-h-9 mb-4">
              <div class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold mb-2">Getting Started with TimeX</h3>
            <p class="text-gray-600">Learn the basics of TimeX in this introductory video.</p>
          </div>

          <!-- Tutorial 2 -->
          <div class="video-card">
            <div class="aspect-w-16 aspect-h-9 mb-4">
              <div class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold mb-2">Advanced Features Tutorial</h3>
            <p class="text-gray-600">Deep dive into TimeX's advanced features and capabilities.</p>
          </div>

          <!-- Tutorial 3 -->
          <div class="video-card">
            <div class="aspect-w-16 aspect-h-9 mb-4">
              <div class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold mb-2">Admin Dashboard Tutorial</h3>
            <p class="text-gray-600">Learn how to effectively manage your organization using the admin dashboard.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Channels -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-16">Get Support</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Email Support -->
          <div class="support-card text-center">
            <div class="icon-wrapper mx-auto mb-6">
              <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Email Support</h3>
            <p class="text-gray-600 mb-4">Get help from our support team via email</p>
            <button class="btn-primary">Contact Support</button>
          </div>

          <!-- Live Chat -->
          <div class="support-card text-center">
            <div class="icon-wrapper mx-auto mb-6">
              <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Live Chat</h3>
            <p class="text-gray-600 mb-4">Chat with our support team in real-time</p>
            <button class="btn-primary">Start Chat</button>
          </div>

          <!-- Phone Support -->
          <div class="support-card text-center">
            <div class="icon-wrapper mx-auto mb-6">
              <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Phone Support</h3>
            <p class="text-gray-600 mb-4">Get immediate assistance over the phone</p>
            <button class="btn-primary">Call Support</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Community Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold mb-6">Join Our Community</h2>
          <p class="text-xl text-gray-600 mb-8">
            Connect with other TimeX users, share best practices, and get help from the community.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button class="btn-primary">Join Forum</button>
            <button class="btn-outline-primary">View Discussions</button>
          </div>
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
.quick-link-card {
  @apply bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer;
}

.resource-card {
  @apply bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300;
}

.video-card {
  @apply bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300;
}

.support-card {
  @apply bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300;
}

.icon-wrapper {
  @apply p-3 bg-primary bg-opacity-10 rounded-lg inline-block;
}

.btn-primary {
  @apply px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-colors duration-300;
}

.btn-outline-primary {
  @apply px-6 py-2 bg-transparent text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-300;
}
</style> 