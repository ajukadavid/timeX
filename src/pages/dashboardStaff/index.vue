<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/userStore";

const store = useUserStore();

const { name, role } = storeToRefs(store);

onMounted(() => {});
</script>

<template>
  <main class="p-10">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-2xl font-bold">Welcome, {{ name }}</span>
        <span class="text-sm font-light"
          >Here is the breakdown of your sign in time</span
        >
      </div>
    </div>
  </main>
</template>
