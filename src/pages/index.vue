<script setup>
import axios from "axios";
import { setupInterceptors } from "../composables/helpers/axios-interceptor";
const colorMode = useColorMode();

const axiosInstance = setupInterceptors(axios.create());

async function fetchData() {
  const data = {
    lastName: "doe",
    email: "testmail@brr.com",
    phone: "0902223421",
  };

  try {
    const response = await axiosInstance.post("/staffs", data);
    // Handle the response here
    console.log(response);
  } catch (error) {
    // Handle errors here
  }
}

onMounted(() => {
  fetchData();
});

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>
