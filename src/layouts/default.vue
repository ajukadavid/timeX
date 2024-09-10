<script setup lang="ts">
const isSideBarOpened = useState("showNav");
</script>
<template>
  <div class="bg-white dark:bg-primary-800 h-screen w-full flex overflow-hidden">
    <XSidebar />
    <div
      class="flex flex-col w-full flex-1 overflow-hidden"
      :class="isSideBarOpened ? 'ml-64' : 'ml-16'"
    >
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>
