<script setup>
const colorMode = useColorMode();

// async function fetchData() {
//   const data = {
//     lastName: "doe",
//     email: "testmail@brr.com",
//     phone: "0902223421",
//   };

//   try {
//     const response = await axiosInstance.post("/staffs", data);
//     // Handle the response here
//     // eslint-disable-next-line no-console
//     console.log(response);
//   } catch (error) {
//     // Handle errors here
//   }
// }

// onMounted(() => {
//   fetchData();
// });

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
  <div>
    <div class="grid place-content-center h-screen">
      <ClientOnly>
        <UButton
          :icon="
            isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
          "
          color="gray"
          variant="ghost"
          aria-label="Theme"
          @click="isDark = !isDark"
        />

        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
      <div class="flex items-center gap-5">
        <UButton
          to="/login"
          size="lg"
          label="Login"
          color="white"
          variant="solid"
        />
        <UButton
          to="/register"
          size="lg"
          label="Register"
          color="white"
          variant="solid"
        />
      </div>
    </div>
  </div>
</template>
