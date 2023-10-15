<script lang="ts" setup>
import { StaffData } from "@/types/data";
defineProps({
  staffData: {
    type: Array as PropType<StaffData[]>,
    required: true,
  },
});
const columns = [
  {
    key: "_id",
    label: "ID",
  },
  {
    key: "firstName",
    label: "First Name",
  },
  {
    key: "lastName",
    label: "Last Name",
  },
  {
    key: "role",
    label: "Staff Role",
  },
  {
    key: "email",
    label: "Email",
  },
];
</script>

<template>
  <UTable :columns="columns" :rows="staffData" />
</template>
