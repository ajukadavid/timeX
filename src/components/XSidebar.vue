<script setup lang="ts">
import { useUserStore } from '@/store/userStore';
const showNav = useState("showNav", () => true);
const store = useUserStore();

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

const handleLogout = () => {
  localStorage.removeItem('userType');
  localStorage.removeItem('token');
  navigateTo('/login');
};

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
    onClick: handleLogout
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

const toggleSidebar = () => {
  showNav.value = !showNav.value;
};

const userType = store.$state.userRole

const filteredLinks = computed(() => {
  if (userType !== 'Admin') {
    return links.filter(link => 
      !['Dashboard', 'User Management'].includes(link.label)
    );
  }
  return links;
});

const filteredIconLinks = computed(() => {
  if (userType === 'Admin') {
    return iconLinks.filter(link => 
      link.to !== '/dashboard' && link.to !== '/user-management'
    );
  }
  return iconLinks;
});

onMounted(() => {
  console.log(store.$state)
})

</script>

<template>
  <aside
    class="h-screen fixed bg-white dark:bg-primary-800 border border-gray-400 flex flex-col transition-all duration-300 z-50"
    :class="[
      showNav ? 'w-64' : 'w-0 md:w-16',
      'md:translate-x-0',
      showNav ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <div
      class="py-4 border-b flex items-center justify-center border-gray-400 dark:bg-[#2D2F39] bg-gray-100"
      :class="showNav ? 'px-6' : 'px-2'"
    >
      <h2
        v-if="showNav"
        class="font-sans text-2xl cursor-pointer font-bold text-blueZodiac dark:text-white"
        @click="toggleSidebar"
      >
        <span> TimeX </span>
      </h2>
      <UIcon
        v-else
        name="i-heroicons-bars-3-20-solid"
        class="text-[28px] cursor-pointer hover:scale-110 dark:text-white text-slate-800 md:block hidden"
        @click="toggleSidebar"
      />
    </div>
    <div
      class="space-y-5 overflow-y-scroll flex-1"
      :class="showNav ? 'px-6' : 'px-2'"
    >
      <h3
        class="text-xs mt-4 mb-2 font-medium"
        :class="{ 'hidden': !showNav, 'md:block': true }"
      ></h3>
      <UVerticalNavigation
        :links="showNav ? filteredLinks : filteredIconLinks"
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
          :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
          color="gray"
          variant="ghost"
          aria-label="Toggle dark mode"
          @click="isDark = !isDark"
        />
      </ClientOnly>
    </div>
  </aside>
  <div
    class="fixed top-4 left-4 z-50 md:hidden"
    @click="toggleSidebar"
  >
    <UIcon
      v-if="!showNav"
      name="i-heroicons-bars-3-20-solid"
      class="text-[28px] cursor-pointer hover:scale-110 dark:text-white text-slate-800"
    />
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}
</style>
