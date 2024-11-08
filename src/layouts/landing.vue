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

// Add features data
const features = [
  {
    icon: 'i-heroicons-user',
    title: 'User Management',
    description: 'Easily manage your workforce with our intuitive user management system.'
  },
  {
    icon: 'i-heroicons-inbox-arrow-down',
    title: 'Sign-In Invites',
    description: 'Streamline the onboarding process with automated sign-in invitations.'
  },
  {
    icon: 'i-heroicons-clock',
    title: 'Automatic Time Logging',
    description: 'Track attendance and working hours automatically with precision.'
  },
  {
    icon: 'i-heroicons-bell-alert',
    title: 'Late Arrival Notifications',
    description: 'Stay informed with instant notifications for attendance exceptions.'
  }
]
</script>

<template>
  <!-- Header - Added gradient background and improved spacing -->
  <div class="flex flex-col min-h-screen">
    <nav class="flex justify-between bg-white/90 backdrop-blur-sm sticky top-0 items-center px-8 py-6 shadow-sm z-50">
      <img src="/logo.png" class="w-12 md:w-20 cursor-pointer transition-transform hover:scale-105" />
      <div class="flex gap-4">
        <nuxt-link class="cursor-pointer" to="/register">
          <UButton size="lg" color="primary" variant="soft" class="font-semibold">
            Sign up
          </UButton>
        </nuxt-link>
        <nuxt-link class="cursor-pointer" to="/login">
          <UButton size="lg" color="primary" variant="solid" class="font-semibold">
            Log in
          </UButton>
        </nuxt-link>
      </div>
    </nav>

    <!-- Hero Section - Updated color scheme -->
    <div class="relative overflow-hidden bg-gradient-to-br from-[#2E2E41] via-[#3F3D56] to-[#6C63FF] py-24 px-8 md:px-20">
      <!-- Decorative background elements -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-96 h-96 bg-[#6C63FF]/20 rounded-full filter blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#E6E6E6]/10 rounded-full filter blur-3xl"></div>
      </div>

      <!-- Subtle pattern overlay -->
      <div class="absolute inset-0 bg-pattern opacity-5"></div>
      
      <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <!-- Text content -->
        <div class="space-y-8">
          <h1 class="text-[#E6E6E6] text-4xl md:text-6xl font-extrabold leading-tight splashText">
            {{ staticText }}<br />
            <span class="text-[#6C63FF] bg-white/90 px-2 rounded-lg transition-all duration-300">
              {{ dynamicText }}.
            </span>
          </h1>
          <p class="text-[#E6E6E6]/90 text-lg md:text-xl max-w-xl">
            Transform your workforce management with our innovative HR Time Management System.
          </p>
          <div class="flex gap-4">
            <UButton 
              size="xl" 
              class="bg-[#6C63FF] hover:bg-[#6C63FF]/90 text-white text-xl font-bold px-8 py-4 transform hover:scale-105 transition-all"
            >
              Get Started Today
            </UButton>
            <UButton 
              size="xl" 
              class="border-2 border-[#E6E6E6] text-[#E6E6E6] hover:bg-white/10 text-xl font-bold px-8 py-4 transform hover:scale-105 transition-all"
            >
              Watch Demo
            </UButton>
          </div>
        </div>

        <!-- Hero art -->
        <div class="hidden md:block relative">
          <img 
            src="/hero_art.svg" 
            class="w-full h-auto animate-float hero-image relative z-10" 
            alt="HR Management System Illustration" 
          />
          
          <!-- Decorative elements -->
          <div class="absolute -top-4 -right-4 w-20 h-20 bg-[#6C63FF]/20 rounded-full animate-pulse"></div>
          <div class="absolute -bottom-4 -left-4 w-12 h-12 bg-[#E6E6E6]/20 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>

    <!-- About Section - Improved layout and readability -->
    <div class="py-20 px-8 md:px-20 bg-gray-50">
      <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <img src="/about_us.jpg" class="w-full h-auto rounded-2xl shadow-xl" />
        <div class="space-y-6">
          <h2 class="text-3xl md:text-4xl font-bold text-primary mb-6">About Our Solution</h2>
          <div class="text-gray-700 space-y-4 text-lg leading-relaxed">
            <!-- Split the large paragraph into smaller chunks -->
            <p>Our HR Time Management System is a comprehensive software application
              designed to streamline employee attendance management, sign-in
              records, and punctuality monitoring for organizations.</p>
            <!-- ... rest of the text split into paragraphs ... -->
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section - Improved cards and hover effects -->
    <div class="py-20 px-8 md:px-20 bg-white">
      <div class="max-w-7xl mx-auto space-y-12">
        <h2 class="text-4xl font-bold text-primary text-center">Our Core Features</h2>
        <div class="grid md:grid-cols-4 gap-8">
          <div v-for="feature in features" :key="feature.title" 
            class="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <UIcon :name="feature.icon" class="text-6xl text-primary mb-4" />
            <h3 class="text-xl font-semibold text-primary">{{ feature.title }}</h3>
            <p class="text-gray-600 mt-2">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Sections - Enhanced styling -->
    <div class="bg-yellow-50 py-20 px-8 md:px-20">
      <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <h2 class="text-4xl md:text-5xl font-bold text-primary leading-tight">
            Revolutionize Your Workforce Management
          </h2>
          <UButton size="lg" color="primary" variant="solid" class="text-xl font-semibold">
            Learn More
          </UButton>
        </div>
        <img src="/image.png" class="w-full h-auto" />
      </div>
    </div>

    <!-- Footer - Improved layout and added content -->
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-8 py-20">
        <div class="grid md:grid-cols-3 gap-12">
          <div class="space-y-4">
            <img src="/logo.png" class="w-32" />
            <p class="text-gray-400">Empowering organizations with smart HR solutions.</p>
          </div>
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Quick Links</h3>
            <div class="flex flex-col space-y-2">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">FAQ</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">About Us</a>
            </div>
          </div>
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">Connect With Us</h3>
            <div class="flex space-x-4">
              <!-- Add social media icons here -->
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Existing animations */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

/* New styles for hero section */
.hero-image {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
}

.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E6E6E6' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.splashText {
  font-family: "AllenSans";
}

/* Optional: Add a reveal animation for the hero content */
@keyframes reveal {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-content {
  animation: reveal 1s ease-out forwards;
}
</style>
