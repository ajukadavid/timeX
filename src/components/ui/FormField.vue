<script setup lang="ts">
interface Props {
  label?: string
  name?: string
  error?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})
</script>

<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="name"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>
