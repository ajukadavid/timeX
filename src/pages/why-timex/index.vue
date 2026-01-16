<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center -mx-4">
          <div class="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Why Choose <br/>
              <span class="text-primary">TimeX?</span>
            </h1>
            <p class="text-xl text-gray-600 mb-8">
              Discover why TimeX is the preferred choice for modern workforce management, trusted by industry leaders worldwide.
            </p>
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="achievement p-4 bg-white rounded-lg shadow-sm">
                <p class="text-3xl font-bold text-primary">99.9%</p>
                <p class="text-gray-600">Accuracy Rate</p>
              </div>
              <div class="achievement p-4 bg-white rounded-lg shadow-sm">
                <p class="text-3xl font-bold text-primary">500+</p>
                <p class="text-gray-600">Enterprise Clients</p>
              </div>
              <div class="achievement p-4 bg-white rounded-lg shadow-sm">
                <p class="text-3xl font-bold text-primary">30%</p>
                <p class="text-gray-600">Cost Reduction</p>
              </div>
              <div class="achievement p-4 bg-white rounded-lg shadow-sm">
                <p class="text-3xl font-bold text-primary">24/7</p>
                <p class="text-gray-600">Support</p>
              </div>
            </div>
          </div>
          <div class="w-full lg:w-1/2 px-4">
            <div class="relative">
              <img src="/hero_art.svg" alt="Why TimeX" class="w-full h-auto"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">What Sets Us Apart</h2>
          <p class="text-xl text-gray-600">
            TimeX combines cutting-edge technology with user-friendly design to deliver unmatched value.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- AI Technology -->
          <div class="feature-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Advanced AI Technology</h3>
            <p class="text-gray-600">
              Our proprietary AI algorithms ensure 99.9% accuracy in time tracking and attendance verification.
            </p>
            <ul class="mt-4 space-y-2">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Machine Learning Powered
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Real-time Processing
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Continuous Learning
              </li>
            </ul>
          </div>

          <!-- Security -->
          <div class="feature-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Enterprise-Grade Security</h3>
            <p class="text-gray-600">
              Bank-level encryption and compliance with international security standards.
            </p>
            <ul class="mt-4 space-y-2">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                256-bit Encryption
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                GDPR Compliant
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Regular Security Audits
              </li>
            </ul>
          </div>

          <!-- Scalability -->
          <div class="feature-card">
            <div class="icon-wrapper mb-6">
              <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Unlimited Scalability</h3>
            <p class="text-gray-600">
              Grow your business without worrying about system limitations or performance.
            </p>
            <ul class="mt-4 space-y-2">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Cloud Infrastructure
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Auto-scaling
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Global Availability
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">TimeX vs. Traditional Solutions</h2>
          <p class="text-xl text-gray-600">
            See how TimeX outperforms traditional workforce management solutions.
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded-xl shadow-sm">
            <thead>
              <tr class="border-b">
                <th class="p-6 text-left">Features</th>
                <th class="p-6 text-center text-primary">TimeX</th>
                <th class="p-6 text-center text-gray-500">Traditional Solutions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-6">AI-Powered Accuracy</td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
              </tr>
              <tr class="border-b">
                <td class="p-6">Real-time Analytics</td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td class="p-6 text-center">Limited</td>
              </tr>
              <tr class="border-b">
                <td class="p-6">GPS Verification</td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td class="p-6 text-center">Additional Cost</td>
              </tr>
              <tr class="border-b">
                <td class="p-6">Mobile Access</td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td class="p-6 text-center">Limited</td>
              </tr>
              <tr>
                <td class="p-6">24/7 Support</td>
                <td class="p-6 text-center">
                  <svg class="w-6 h-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td class="p-6 text-center">Business Hours Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p class="text-xl text-gray-600">
            Hear from industry leaders who have transformed their operations with TimeX.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Testimonial 1 -->
          <div class="testimonial-card">
            <div class="mb-6">
              <div class="flex text-yellow-400">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <blockquote class="text-gray-600 mb-6">
              "TimeX has completely transformed how we manage our workforce. The AI-powered features and real-time analytics have given us unprecedented visibility and control."
            </blockquote>
            <div class="flex items-center">
              <img src="/review.svg" alt="Client" class="w-12 h-12 rounded-full mr-4"/>
              <div>
                <p class="font-semibold">Robert Chen</p>
                <p class="text-gray-600">CEO, TechCorp Inc.</p>
              </div>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div class="testimonial-card">
            <div class="mb-6">
              <div class="flex text-yellow-400">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <blockquote class="text-gray-600 mb-6">
              "The accuracy and reliability of TimeX's attendance tracking have significantly reduced our administrative overhead. Their customer support is exceptional."
            </blockquote>
            <div class="flex items-center">
              <img src="/review.svg" alt="Client" class="w-12 h-12 rounded-full mr-4"/>
              <div>
                <p class="font-semibold">Sarah Williams</p>
                <p class="text-gray-600">HR Director, Global Manufacturing</p>
              </div>
            </div>
          </div>

          <!-- Testimonial 3 -->
          <div class="testimonial-card">
            <div class="mb-6">
              <div class="flex text-yellow-400">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <blockquote class="text-gray-600 mb-6">
              "Implementing TimeX was seamless, and the ROI was immediate. Their mobile app has made it incredibly easy for our employees to manage their time."
            </blockquote>
            <div class="flex items-center">
              <img src="/review.svg" alt="Client" class="w-12 h-12 rounded-full mr-4"/>
              <div>
                <p class="font-semibold">Michael Thompson</p>
                <p class="text-gray-600">Operations Manager, Retail Chain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the TimeX Difference?</h2>
        <p class="text-xl mb-8 opacity-90">Join thousands of companies already optimizing their workforce with TimeX</p>
        <div class="flex flex-wrap justify-center gap-4">
          <button class="btn-white">Start Free Trial</button>
          <button class="btn-outline-white">Schedule Demo</button>
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

.icon-wrapper {
  @apply p-3 rounded-lg inline-block;
  background-color: color-mix(in srgb, var(--color-primary-500) 10%, transparent);
}

.achievement {
  @apply hover:shadow-md transition-shadow duration-300;
}

.testimonial-card {
  @apply p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300;
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
</style> 