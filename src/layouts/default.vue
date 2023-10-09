<script setup>
const showNav = ref(false);
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const links = [
  {
    label: "Dashboard",
    icon: "i-heroicons-arrows-pointing-out-20-solid",
    to: "/dashboardEmployer",
  },
  {
    label: "User Management",
    icon: "i-heroicons-user-plus-20-solid",
    to: "/user-management",
  },
  {
    label: "Log out",
    icon: "i-heroicons-arrow-left-on-rectangle-20-solid",
    to: "/login",
  },
];

const iconLinks = [
  {
    icon: "i-heroicons-arrows-pointing-out-20-solid",
    to: "/dashboard",
  },
  {
    icon: "i-heroicons-user-plus-20-solid",
    to: "/user-management",
  },
  {
    icon: "i-heroicons-arrow-left-on-rectangle-20-solid",
    to: "/login",
  },
];
</script>
<template>
  <div class="w-full flex">
    <aside
      class="h-screen bg-white border-r-2 dark:border-0 border border-slate-800 dark:bg-slate-800 items-center flex flex-col justify-between"
    >
      <div>
        <h2
          v-if="!showNav"
          class="my-6 text-2xl cursor-pointer font-bold text-blueZodiac dark:text-white"
          @click="showNav = !showNav"
        >
          <span> TimeX </span>
        </h2>
        <UIcon
          v-else
          name="i-heroicons-bars-4-20-solid"
          class="text-[28px] mt-10 cursor-pointer hover:scale-110 dark:text-white text-slate-800"
          @click="showNav = !showNav"
        />
      </div>
      <UVerticalNavigation
        :links="showNav ? iconLinks : links"
        :ui="{
          base: 'group relative flex py-5 items-center gap-1 mb-20 mt-5 text-[15px] focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-1 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 before:absolute before:inset-px before:rounded-md disabled:cursor-not-allowed disabled:opacity-75',
        }"
      >
        <template #icon="{ link }">
          <UIcon
            :name="link.icon"
            class="text-[20px] hover:scale-110 dark:text-white text-slate-800"
          />
        </template>
      </UVerticalNavigation>
      <div class="flex-start py-2 px-4 w-full">
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
      </div>
    </aside>
    <div>
      <slot />
    </div>
  </div>
</template>
