<script setup lang="ts">
const showNav = useState("showNav");
</script>

<template>
  <div class="bg-white dark:bg-primary-800 min-h-screen w-full flex overflow-hidden">
    <XSidebar />
    <div
      class="flex flex-col w-full flex-1 overflow-hidden transition-all duration-300"
      :class="[
        showNav ? 'md:ml-64' : 'md:ml-16',
        showNav ? 'ml-64' : 'ml-0'
      ]"
    >
      <div class="flex-1 overflow-y-auto p-4 md:p-10">
        <slot />
      </div>
    </div>
  </div>
</template>
