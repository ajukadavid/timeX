<script lang="ts" setup>
import { ref } from "vue";

interface DropdownItem {
  name: string;
  value: string | number;
  id?: string;
}

const props = defineProps<{
  items: DropdownItem[];
  placeholder?: string;
}>()

const emit = defineEmits<{
  (e: 'select', value: string | number | any ): void;
}>()

const isOpen = ref(false);
const selectedItem = ref<DropdownItem | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectItem = (item: DropdownItem) => {
  selectedItem.value = item;
  isOpen.value = false;
  emit('select', item);
};
</script>

<template>
  <div class="relative w-full">
    <button
      @click="toggleDropdown"
      class="w-full bg-white text-left px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center"
    >
      <span class="text-gray-700">{{ selectedItem?.name || props.placeholder || 'Select an option' }}</span>
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute mt-1 w-full bg-white shadow-lg rounded-lg z-10"
    >
      <ul class="max-h-24 overflow-y-auto">
        <li
          v-for="item in props.items"
          :key="item.id"
          @click="selectItem(item)"
          class="cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Add custom styles here if necessary */
</style>
