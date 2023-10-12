<template>
  <UModal v-model="showModal">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex justify-between dark:text-white text-slate-800">
          <slot v-if="showHeader" name="header"></slot>
          <UIcon
            name="i-heroicons-x-mark"
            class="text-[20px] shrink-0 hover:scale-110 cursor-pointer"
            @click="showModal = false"
          />
        </div>
      </template>

      <slot></slot>

      <template v-if="showFooter" #footer>
        <!-- Content -->
        <slot name="footer"></slot>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const showModal = useState("showModal", () => false);
defineProps({
  showHeader: Boolean,
  showFooter: Boolean,
});
</script>
