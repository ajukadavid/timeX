<script lang="ts" setup>
import { getStaffs } from "@/composables/services/data/data";

onMounted(() => {
  getStaffs();
});
</script>

<template>
  <main class="p-10">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-2xl font-bold">Employees</span>
        <span class="text-sm font-light">Here is a list of all employees</span>
      </div>
      <UButton
        type="submit"
        size="lg"
        color="white"
        variant="solid"
        class="self-start"
      >
        Add Employees
      </UButton>
    </div>
  </main>
</template>
