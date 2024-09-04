<script setup lang="ts">
const isSideBarOpened = useState("showNav");
</script>
<template>
  <div class="bg-white dark:bg-primary-800 h-screen w-full flex">
    <XSidebar />
    <div
      class="flex flex-col w-full flex-1"
      :class="isSideBarOpened ? 'ml-64' : 'ml-16'"
    >
      <slot />
    </div>
  </div>
</template>
