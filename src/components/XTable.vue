<script lang="ts" setup>
const emit = defineEmits(["prevPage", "nextPage"]);

const props = defineProps({
  tableData: {
    type: Array as PropType<any>,
    required: true,
  },
  paginationData: {
    type: Object,
    required: true,
  },
  columns: {
    type: Array as PropType<{ key: string; label?: string }[]>,
    required: true,
  },
  itemsGenerator: {
    type: Function as PropType<(row: any) => any[]>,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const generateItems = (row: any) => props.itemsGenerator ? props.itemsGenerator(row) : [];
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full flex mb-2 justify-end">
      <UPagination
        v-model="props.paginationData.page"
        :page-count="props.paginationData.count"
        :total="props.paginationData?.total"
      >
        <template #prev>
          <UTooltip text="Previous page">
            <UButton
              icon="i-heroicons-arrow-small-left-20-solid"
              color="primary"
              :ui="{ rounded: 'rounded-full' }"
              class="rtl:[&_span:first-child]:rotate-180 me-2 dark:bg-white dark:text-primary-800 hover:dark:bg-white hover:dark:text-primary-800 dark:border-primary-800"
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
              class="rtl:[&_span:last-child]:rotate-180 ms-2 dark:bg-white dark:text-primary-800 hover:dark:bg-white hover:dark:text-primary-800 dark:border-primary-800"
              @click="emit('nextPage', paginationData.next)"
            />
          </UTooltip>
        </template>
      </UPagination>
    </div>
    <div class="overflow-x-auto relative">
      <div v-if="props.loading" class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center">
        <UIcon name="i-heroicons-arrow-path-20-solid" class="w-8 h-8 animate-spin text-primary-500" />
      </div>
      <UTable :columns="props.columns" :rows="props.tableData">
        <template #entryTime-data="{ row }">
          <span class="text-base" :class="row.late ? 'text-red-700' : 'text-green-700'">{{ row.entryTime }}</span> 
        </template>
        <template v-if="props.itemsGenerator" #actions-data="{ row }">
          <UDropdown :items="generateItems(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>
    </div>
  </div>
</template>
