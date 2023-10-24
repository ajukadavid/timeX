<script lang="ts" setup>
import { StaffData } from "@/types/data";

const emit = defineEmits(["prevPage", "nextPage"]);

defineProps({
  staffData: {
    type: Array as PropType<StaffData[]>,
    required: true,
  },
  paginationData: {
    type: Object,
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
  {
    key: "actions",
  },
];

const items = (row: any) => [
  [
    {
      label: "View Employee",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit", row.id),
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate-20-solid",
    },
  ],
  [
    {
      label: "Archive",
      icon: "i-heroicons-archive-box-20-solid",
    },
    {
      label: "Move",
      icon: "i-heroicons-arrow-right-circle-20-solid",
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
    },
  ],
];
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full flex mb-2 justify-end">
      <UPagination
        v-model="paginationData.page"
        :page-count="paginationData.count"
        :total="paginationData.total"
      >
        <template #prev>
          <UTooltip text="Previous page">
            <UButton
              icon="i-heroicons-arrow-small-left-20-solid"
              color="primary"
              :ui="{ rounded: 'rounded-full' }"
              class="rtl:[&_span:first-child]:rotate-180 me-2"
              @click="emit('prevPage', paginationData.prev)"
            />
          </UTooltip>
        </template>
        <template #next>
          <UTooltip text="Next page">
            <UButton
              icon="i-heroicons-arrow-small-right-20-solid"
              color="primary"
              :ui="{ rounded: 'rounded-full' }"
              class="rtl:[&_span:last-child]:rotate-180 ms-2"
              @click="emit('nextPage', paginationData.next)"
            />
          </UTooltip>
        </template>
      </UPagination>
    </div>
    <UTable :columns="columns" :rows="staffData">
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>
  </div>
</template>
