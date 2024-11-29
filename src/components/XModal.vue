<template>
  <UModal 
    v-model="isOpen" 
    :size="size"
  >
    <UCard>
      <!-- Header -->
      <template #header>
        <div class="flex items-center" :class="[title ? 'justify-between' : 'justify-end']">
          <div v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </div>
          <slot name="header"></slot>
          
          <UIcon
            name="i-heroicons-x-mark"
            class="text-[20px] shrink-0 hover:scale-110 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            @click="closeModal"
          />
        </div>
      </template>

      <!-- Body -->
      <slot></slot>

      <!-- Footer -->
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: boolean
  modalId: string
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': [modalId: string]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const closeModal = () => {
  isOpen.value = false
  emit('close', props.modalId)
}
</script>



