<script lang="ts" setup>
import { getStaff } from '@/composables/services/data/data';
import { useUserStore } from '@/store/userStore';

const store = useUserStore();
const $route = useRoute();
definePageMeta({
  layout: 'staff'
})

const staffTableData = ref<any[]>([]);

const paginationData = {
  page: 1,        
  count: 5,       
  total: 10,       
  prev: null,      
  next: 2      
};


const columns = [
  {
    key: "entryDate",
    label: "Date",
  },
  {
    key: "entryTime",
    label: "Sign in Time",
  },

];


const items = (row: any) => [
  [
    { "id": "18:00", "name": "" },
    
  ]

];

onMounted( async () => {
  const staffData = await getStaff($route.params.id);
  staffData.entryLogs.map((val:any) => {
    val.entryDate = new Date(val.entryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    val.entryTime = new Date(val.entryTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  })
  staffTableData.value = staffData.entryLogs

   store.$patch({
      role: staffData.staff.role,
      name: `${staffData.staff.firstName} ${staffData.staff.lastName}`,
    });
});
</script>

<template>
  <main class="w-full px-10 mt-5">
    <div class=" w-full">
      <XTable :rows="columns" :paginationData="paginationData" :columns="columns" :table-data="staffTableData">
      
      </XTable>
    
    </div>  
  </main>
</template>
