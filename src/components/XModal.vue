<template>
  <div>
    <UModal v-model="showModal">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <!-- Content -->
        </template>

        <!-- Content -->

        <template #footer>
          <!-- Content -->
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
const showModal = useState("showModal", () => false);
</script>
