<script lang="ts" setup>
import { ref, computed, watch } from 'vue';

const emit = defineEmits(["prevPage", "nextPage"]);

const props = defineProps({
  tableData: {
    type: Array as PropType<any[]>,
    required: true,
    default: () => []
  },
  paginationData: {
    type: Object,
    required: true,
  },
  columns: {
    type: Array as PropType<{ key: string; label?: string; id?: string }[]>,
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

// Debug: Log data when it changes
watch(() => props.tableData, (newData) => {
  console.log('Table data updated:', newData);
}, { deep: true });

// Computed to ensure we have valid data
const hasData = computed(() => {
  return props.tableData && Array.isArray(props.tableData) && props.tableData.length > 0;
});

// Dropdown state management
const openDropdownId = ref<string | null>(null);

const toggleDropdown = (rowId: string) => {
  openDropdownId.value = openDropdownId.value === rowId ? null : rowId;
};

const closeDropdown = () => {
  openDropdownId.value = null;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('.dropdown-container')) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleActionClick = (action: any) => {
  if (action.click) {
    action.click();
  }
  closeDropdown();
};
</script>

<template>
  <div class="flex flex-col w-full">
    <!-- Pagination Controls -->
    <div class="w-full flex mb-4 justify-end">
      <div class="flex items-center gap-2">
        <button
          v-if="paginationData.prev"
          @click="emit('prevPage', paginationData.prev)"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          aria-label="Previous page"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-sm text-gray-600 px-3">
          Page {{ paginationData.page || 1 }} of {{ paginationData.count || 1 }}
        </span>
        <button
          v-if="paginationData.next"
          @click="emit('nextPage', paginationData.next)"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          aria-label="Next page"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="overflow-x-auto relative bg-white rounded-lg border border-gray-200">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg">
        <div class="flex flex-col items-center gap-2">
          <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-600">Loading...</span>
        </div>
      </div>

      <!-- Table -->
      <table v-if="hasData" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.id || column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.label || column.key }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, rowIndex) in tableData"
            :key="row._id || rowIndex"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.id || column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <!-- Actions Column -->
              <div v-if="column.key === 'actions'" class="relative dropdown-container">
                <button
                  @click="toggleDropdown(row._id || rowIndex.toString())"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Actions"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                <!-- Dropdown Menu -->
                <div
                  v-if="openDropdownId === (row._id || rowIndex.toString())"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20"
                >
                  <div class="py-1">
                    <template v-for="(group, groupIndex) in generateItems(row)" :key="groupIndex">
                      <button
                        v-for="(item, itemIndex) in group"
                        :key="itemIndex"
                        @click="handleActionClick(item)"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                      >
                        <!-- Eye Icon -->
                        <svg v-if="item.icon && item.icon.includes('eye')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <!-- Trash Icon -->
                        <svg v-else-if="item.icon && item.icon.includes('trash')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <!-- Wrench Icon -->
                        <svg v-else-if="item.icon && item.icon.includes('wrench')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {{ item.label }}
                      </button>
                      <div v-if="groupIndex < generateItems(row).length - 1" class="border-t border-gray-100 my-1"></div>
                    </template>
                  </div>
                </div>
              </div>
              
              <!-- Regular Data Columns -->
              <span v-else>
                {{ row[column.key] || '-' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p class="mt-1 text-sm text-gray-500">There are no records to display.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
