<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">

const staticText = "Manage Your Staff Processes More ";
const array = ["Productively", "Competently", "Expediently", "Resourcefully", "Systematically"];
const speed = 50;

const i = ref(0);
const j = ref(0);

const dynamicText = ref(array[0]);

const typeWriter = () => {
  const targetText = array[j.value];
  if (i.value < targetText.length) {
    dynamicText.value = targetText.substring(0, i.value + 1);
    i.value++;
    setTimeout(typeWriter, speed);
  } else {
    i.value = 0; // Reset index for next word
  }
};

const rotate = () => {
  j.value = (j.value + 1) % array.length;
  typeWriter();
};

const startTyping = () => {
  typeWriter();
  setInterval(rotate, 5000);
};

onMounted(() => {
  startTyping();
});

// Enhanced features data with more detailed information
const features = [
  {
    icon: 'i-heroicons-user-group',
    title: 'Smart User Management',
    description: 'Intuitive dashboard to manage your entire workforce with role-based permissions and automated workflows.',
    highlight: 'Save 5+ hours weekly'
  },
  {
    icon: 'i-heroicons-envelope',
    title: 'Automated Invitations',
    description: 'Streamlined onboarding with smart sign-in invitations and customizable welcome sequences.',
    highlight: '90% faster onboarding'
  },
  {
    icon: 'i-heroicons-clock',
    title: 'Precision Time Tracking',
    description: 'AI-powered automatic time logging with GPS verification and real-time attendance monitoring.',
    highlight: '99.9% accuracy'
  },
  {
    icon: 'i-heroicons-bell-alert',
    title: 'Smart Notifications',
    description: 'Intelligent alerts for attendance exceptions with customizable notification preferences.',
    highlight: 'Instant alerts'
  }
];

// New testimonials section
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "HR Director at TechCorp",
    avatar: "/about_us.jpg",
    quote: "TimeX revolutionized our workforce management. We've seen a 40% increase in productivity since implementation.",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Operations Manager at StartupX",
    avatar: "/about_us.jpg", 
    quote: "The automated time tracking feature alone saved us hundreds of hours in manual work. Incredible ROI.",
    rating: 5
  },
  {
    name: "Emma Rodriguez",
    role: "CEO at RemoteFirst",
    avatar: "/about_us.jpg",
    quote: "Managing our global team across 12 time zones is now effortless. TimeX is a game-changer.",
    rating: 5
  }
];

// Enhanced benefits with metrics
const benefits = [
  {
    icon: 'i-heroicons-chart-bar',
    metric: '40%',
    title: 'Productivity Increase',
    description: 'Teams report significant productivity gains within the first month'
  },
  {
    icon: 'i-heroicons-clock',
    metric: '15hrs',
    title: 'Time Saved Weekly',
    description: 'Reduce administrative overhead with automated processes'
  },
  {
    icon: 'i-heroicons-currency-dollar',
    metric: '$50K+',
    title: 'Annual Savings',
    description: 'Average cost savings per organization using TimeX'
  },
  {
    icon: 'i-heroicons-face-smile',
    metric: '98%',
    title: 'Employee Satisfaction',
    description: 'Employees love the simplified time management experience'
  }
];

// FAQ section
const faqs = [
  {
    question: "How quickly can we get started with TimeX?",
    answer: "Most organizations are up and running within 24 hours. Our onboarding team provides personalized setup assistance."
  },
  {
    question: "Is TimeX suitable for remote teams?",
    answer: "Absolutely! TimeX is designed specifically for modern workforces, including remote, hybrid, and distributed teams across multiple time zones."
  },
  {
    question: "What integrations are available?",
    answer: "TimeX integrates with 50+ popular tools including Slack, Microsoft Teams, QuickBooks, and major payroll systems."
  },
  {
    question: "How secure is our data?",
    answer: "We use enterprise-grade security with SOC 2 compliance, end-to-end encryption, and regular security audits."
  }
];

// Mobile menu state
const isMobileMenuOpen = ref(false);
</script>

<template>
  <!-- Modern Navigation with mobile responsiveness -->
  <nav class="flex justify-between bg-white/95 backdrop-blur-md sticky top-0 items-center px-5 md:px-8 py-4 shadow-sm z-50 border-b border-gray-100">
    <div class="flex items-center space-x-8">
      <div class="flex items-center space-x-3">
        <img src="/logo.png" class="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-sm cursor-pointer transition-transform hover:scale-105" />
        <span class="text-2xl font-bold text-primary hidden sm:block">TimeX</span>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex items-center space-x-6">
        <NuxtLink to="/platform" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">Platform</NuxtLink>
        <NuxtLink to="/use-cases" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">Use Cases</NuxtLink>
        <NuxtLink to="/why-timex" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">Why TimeX</NuxtLink>
        <NuxtLink to="/pricing" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">Pricing</NuxtLink>
        <NuxtLink to="/resources" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">Resources</NuxtLink>
      </div>
    </div>

    <!-- Desktop CTA Buttons -->
    <div class="hidden md:flex gap-3">
      <button class="px-6 py-2.5 text-gray-700 hover:text-primary font-medium rounded-lg hover:bg-gray-50 transition-all duration-200">
        Log in
      </button>
      <button class="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
        Get Started Free
      </button>
    </div>

    <!-- Mobile Menu Button -->
    <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden">
      <UIcon name="i-heroicons-bars-3" class="w-6 h-6 text-gray-700" />
    </button>
  </nav>

  <!-- Mobile Menu Overlay -->
  <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="isMobileMenuOpen = false">
    <div class="fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-xl" @click.stop>
      <div class="flex justify-between items-center mb-8">
        <span class="text-xl font-bold text-primary">Menu</span>
        <button @click="isMobileMenuOpen = false">
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
        </button>
      </div>
      <!-- Mobile menu items -->
      <div class="flex flex-col space-y-4">
        <NuxtLink to="/platform" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all" @click="isMobileMenuOpen = false">Platform</NuxtLink>
        <NuxtLink to="/use-cases" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all" @click="isMobileMenuOpen = false">Use Cases</NuxtLink>
        <NuxtLink to="/why-timex" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all" @click="isMobileMenuOpen = false">Why TimeX</NuxtLink>
        <NuxtLink to="/pricing" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all" @click="isMobileMenuOpen = false">Pricing</NuxtLink>
        <NuxtLink to="/resources" class="text-gray-700 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all" @click="isMobileMenuOpen = false">Resources</NuxtLink>
      </div>
    </div>
  </div>

  <!-- Enhanced Hero Section -->
  <div class="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24 px-6 md:px-8">
    <!-- Animated background elements -->
    <div class="absolute inset-0">
      <div class="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
      <!-- Enhanced text content -->
      <div class="space-y-8">
        <!-- Trust badge -->
        <div class="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <div class="flex -space-x-2">
            <img src="/about_us.jpg" class="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/about_us.jpg" class="w-8 h-8 rounded-full border-2 border-white" />
            <img src="/about_us.jpg" class="w-8 h-8 rounded-full border-2 border-white" />
          </div>
          <span>Trusted by 2,000+ companies worldwide</span>
        </div>

        <h1 class="text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {{ staticText }}<br />
          <span class="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {{ dynamicText }}.
          </span>
        </h1>
        
        <p class="text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed">
          The all-in-one HR platform that transforms workforce management with AI-powered automation, real-time insights, and seamless integrations.
        </p>

        <!-- Enhanced CTAs with metrics -->
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="bg-primary hover:bg-primary/90 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Start Free Trial
            </button>
            <button class="border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary text-lg font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
              <UIcon name="i-heroicons-play" class="w-5 h-5 inline mr-2" />
              Watch Demo
            </button>
          </div>
          <p class="text-sm text-gray-500">✓ No credit card required ✓ 14-day free trial ✓ Setup in 5 minutes</p>
        </div>
      </div>

      <!-- Enhanced hero visual -->
      <div class="relative">
        <div class="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
          <img src="/hero_art.svg" class="w-full h-auto animate-float" alt="TimeX Dashboard Preview" />
          
          <!-- Floating UI elements -->
          <div class="absolute -top-4 -right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-bounce">
            ✓ Live
          </div>
          <div class="absolute -bottom-4 -left-4 bg-primary text-white text-xs px-3 py-1 rounded-full animate-pulse">
            Real-time sync
          </div>
        </div>
        
        <!-- Decorative elements -->
        <div class="absolute -top-8 -right-8 w-16 h-16 bg-blue-100 rounded-full animate-ping"></div>
        <div class="absolute -bottom-8 -left-8 w-12 h-12 bg-yellow-100 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  </div>

  <!-- New Benefits Section with Metrics -->
  <div class="py-16 md:py-20 px-6 md:px-8 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Why teams choose TimeX</h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">Join thousands of companies that have transformed their workforce management</p>
      </div>
      
      <div class="grid md:grid-cols-4 gap-8">
        <div v-for="benefit in benefits" :key="benefit.title" 
          class="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <UIcon :name="benefit.icon" class="text-5xl text-primary mb-4 mx-auto" />
          <div class="text-3xl font-bold text-primary mb-2">{{ benefit.metric }}</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ benefit.title }}</h3>
          <p class="text-gray-600 text-sm">{{ benefit.description }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Enhanced About Section -->
  <div class="py-16 md:py-20 px-6 md:px-8 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div class="space-y-6">
          <div class="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
            The Complete Solution
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Everything you need for modern workforce management</h2>
          <div class="text-gray-600 space-y-4 text-lg leading-relaxed">
            <p>TimeX is the only platform that combines AI-powered automation, real-time analytics, and seamless integrations to deliver a complete workforce management solution.</p>
            <p>From global teams to local offices, we handle compliance, time tracking, and employee engagement—all in one intuitive platform.</p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200">
              Explore Platform
            </button>
            <button class="text-primary hover:text-primary/80 font-semibold px-8 py-4 rounded-xl hover:bg-primary/5 transition-all duration-200">
              View Case Studies →
            </button>
          </div>
        </div>
        
        <div class="relative">
          <img src="/office.gif" class="w-full h-auto rounded-2xl shadow-lg" />
          <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl"></div>
        </div>
      </div>

      <!-- Enhanced employee types grid -->
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
          <UIcon name="i-heroicons-globe-americas" class="text-primary text-6xl mx-auto mb-4" />
          <h3 class="text-primary text-xl font-bold mb-3">International Teams</h3>
          <p class="text-gray-600 leading-relaxed">Effortlessly manage remote workers across different time zones with automated compliance and localized features</p>
        </div>
        
        <div class="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
          <UIcon name="i-heroicons-document-check" class="text-primary text-6xl mx-auto mb-4" />
          <h3 class="text-primary text-xl font-bold mb-3">Contract Workers</h3>
          <p class="text-gray-600 leading-relaxed">Streamlined time tracking and project management for freelancers and contractors with flexible billing options</p>
        </div>
        
        <div class="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
          <UIcon name="i-heroicons-building-office" class="text-primary text-6xl mx-auto mb-4" />
          <h3 class="text-primary text-xl font-bold mb-3">Office Teams</h3>
          <p class="text-gray-600 leading-relaxed">Comprehensive attendance monitoring and performance analytics for your in-house workforce</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Enhanced Features Section -->
  <div class="py-16 md:py-20 px-6 md:px-8 bg-white">
    <div class="max-w-7xl mx-auto space-y-16">
      <div class="text-center space-y-4">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Powerful features for every team</h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need to manage your workforce efficiently, from day one to scale</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="feature in features" :key="feature.title" 
          class="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div class="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
            <UIcon :name="feature.icon" class="text-3xl text-primary" />
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900">{{ feature.title }}</h3>
              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{{ feature.highlight }}</span>
            </div>
            <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- New Testimonials Section -->
  <div class="py-16 md:py-20 px-6 md:px-8 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Loved by teams worldwide</h2>
        <p class="text-gray-600 text-lg">Don't just take our word for it</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="testimonial in testimonials" :key="testimonial.name"
          class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
          <div class="flex items-center space-x-1 mb-4">
            <UIcon v-for="i in 5" :key="i" name="i-heroicons-star" class="w-5 h-5 text-yellow-400 fill-current" />
          </div>
          
          <p class="text-gray-700 mb-6 leading-relaxed">"{{ testimonial.quote }}"</p>
          
          <div class="flex items-center space-x-3">
            <img :src="testimonial.avatar" class="w-12 h-12 rounded-full object-cover" />
            <div>
              <div class="font-semibold text-gray-900">{{ testimonial.name }}</div>
              <div class="text-gray-600 text-sm">{{ testimonial.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Enhanced CTA Section -->
  <div class="bg-gradient-to-r from-primary to-blue-600 py-16 md:py-20 px-6 md:px-8">
    <div class="max-w-4xl mx-auto text-center space-y-8">
      <h2 class="text-white text-3xl md:text-5xl font-bold leading-tight">
        Ready to transform your workforce management?
      </h2>
      <p class="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
        Join thousands of companies using TimeX to boost productivity and streamline operations.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button class="bg-white text-primary hover:bg-gray-50 text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
          Start Free Trial
        </button>
        <button class="border-2 border-white text-white hover:bg-white/10 text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-200">
          Schedule Demo
        </button>
      </div>
      
      <p class="text-white/80 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
    </div>
  </div>

  <!-- New FAQ Section -->
  <div class="py-16 md:py-20 px-6 md:px-8 bg-white">
    <div class="max-w-4xl mx-auto">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Frequently asked questions</h2>
        <p class="text-gray-600 text-lg">Everything you need to know about TimeX</p>
      </div>

      <div class="space-y-4">
        <div v-for="faq in faqs" :key="faq.question"
          class="border border-gray-200 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <h3 class="font-semibold text-gray-900 mb-3">{{ faq.question }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Enhanced Footer -->
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <div class="grid md:grid-cols-4 gap-12">
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <img src="/logo.png" class="w-10 h-10 rounded-xl" />
            <span class="text-xl font-bold">TimeX</span>
          </div>
          <p class="text-gray-400 leading-relaxed">Empowering organizations worldwide with intelligent workforce management solutions.</p>
          
          <!-- Social links -->
          <div class="flex space-x-4">
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
              <UIcon name="i-simple-icons-twitter" class="w-5 h-5" />
            </a>
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
              <UIcon name="i-simple-icons-linkedin" class="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Product</h3>
          <div class="flex flex-col space-y-3">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Integrations</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">API</a>
          </div>
        </div>
        
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Company</h3>
          <div class="flex flex-col space-y-3">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">About Us</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Careers</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Blog</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Support</h3>
          <div class="flex flex-col space-y-3">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Help Center</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Documentation</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Community</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Status</a>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400">© 2025 TimeX. All rights reserved.</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Enhanced animations */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(1deg); }
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: transform, box-shadow, background-color, border-color;
  transition-duration: 200ms;
  transition-timing-function: ease-out;
}

/* Custom gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Enhanced hover effects */
.group:hover .group-hover\:bg-primary\/20 {
  background-color: rgba(var(--primary), 0.2);
}

/* Improved spacing and typography */
.max-w-7xl {
  max-width: 80rem;
}

/* Mobile-first responsive design */
@media (max-width: 768px) {
  .hero-content {
    text-align: center;
  }
  
  .grid {
    gap: 2rem;
  }
}

/* Enhanced focus states for accessibility */
button:focus,
a:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
