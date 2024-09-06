<script lang="ts" setup>
import { getStaff } from '@/composables/services/data/data';
import { useUserStore } from '@/store/userStore';

const store = useUserStore();
const $route = useRoute();
definePageMeta({
  layout: 'staff'
})

const staff = {
  firstName: "",
  lastName: "",
}

onMounted( async () => {
  const staffData = await getStaff($route.params.id);
   store.$patch({
      role: staffData.staff.role,
      name: `${staffData.staff.firstName} ${staffData.staff.lastName}`,
    });
});
</script>

<template>
  <main class="p-10">
    <div class="flex items-center justify-between">
    </div>
    
  </main>
</template>
