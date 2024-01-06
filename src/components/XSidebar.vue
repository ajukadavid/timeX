<script setup lang="ts">
const showNav = useState("showNav", () => true);

const iconLinks = [
  {
    label: "",
    icon: "i-heroicons-squares-2x2",
    to: "/dashboard",
  },
  {
    label: "",
    icon: "i-heroicons-user-plus-20-solid",
    to: "/user-management",
  },
  {
    label: "",
    icon: "i-heroicons-arrow-left-on-rectangle-20-solid",
    to: "/login",
  },
];

const links = [
  {
    label: "Dashboard",
    icon: "i-heroicons-squares-2x2",
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

const colorMode = useColorMode();

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
  <aside
    class="h-screen fixed bg-white dark:bg-primary-800 border border-gray-400 flex flex-col"
    :class="showNav ? 'w-64' : 'w-16'"
  >
    <div
      class="py-4 border-b flex items-center justify-center border-gray-400 dark:bg-[#2D2F39] bg-gray-100"
      :class="showNav ? 'px-6' : 'px-2'"
    >
      <h2
        v-if="showNav"
        class="font-sans text-2xl cursor-pointer font-bold text-blueZodiac dark:text-white"
        @click="showNav = !showNav"
      >
        <span> TimeX </span>
      </h2>
      <UIcon
        v-else
        name="i-heroicons-bars-3-20-solid"
        class="text-[28px] cursor-pointer hover:scale-110 dark:text-white text-slate-800"
        @click="showNav = !showNav"
      />
    </div>
    <div
      class="space-y-5 overflow-y-scroll flex-1"
      :class="showNav ? 'px-6' : 'px-2'"
    >
      <h3
        class="text-xs mt-4 mb-2 font-medium"
        :class="{ hidden: !showNav }"
      ></h3>
      <UVerticalNavigation
        :links="showNav ? links : iconLinks"
        :ui="{
          base: 'group relative flex py-2.5 px-3 items-center dark:text-white text-slate-800 gap-[10px] mb-2 text-[15px] focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-1 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 before:absolute before:inset-px before:rounded-md disabled:cursor-not-allowed disabled:opacity-75',
          active:
            'text-primary dark:text-white bg-gray-100 before:bg-gray-100  dark:bg-[#2D2F39] dark:before:bg-[#2D2F39]',
          inactive:
            'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:before:bg-gray-100 dark:hover:before:bg-[#2D2F39] dark:hover:bg-[#2D2F39]',
        }"
      >
        <template #icon="{ link }">
          <UIcon
            :name="link.icon"
            class="text-[20px] shrink-0 hover:scale-110 dark:text-white text-slate-800"
          />
        </template>
      </UVerticalNavigation>
    </div>
    <div
      class="flex-start flex items-center py-6 justify-center w-full dark:bg-[#2D2F39] bg-gray-100"
    >
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
</template>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}
</style>
