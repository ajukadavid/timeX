<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/userStore";

const store = useUserStore();

const { name, role } = storeToRefs(store);
</script>
<template>
  <div class="flex bg-white h-screen dark:bg-primary-800 flex-col">
    <div class="flex items-center justify-between">
      <div class="w-full h-12">
        <img src="/logo.png" class="w-16 md:w-28 cursor-pointer" />
      </div>
      <div class="flex flex-col px-10 pt-10">
        <span class="text-2xl font-bold">Welcome, {{ name }}</span>
        <span class="text-sm font-light">Here is the breakdown of your sign in time</span>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <slot />
    </div>
    

  </div>



</template>