<script setup lang="ts">
interface Props {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  timeout: 3000
})

const emit = defineEmits<{
  close: [id: string]
}>()

const isVisible = ref(true)

onMounted(() => {
  if (props.timeout > 0) {
    setTimeout(() => {
      closeToast()
    }, props.timeout)
  }
})

const closeToast = () => {
  isVisible.value = false
  setTimeout(() => {
    emit('close', props.id)
  }, 300)
}

const typeStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-400',
    iconBg: 'bg-green-100'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-400',
    iconBg: 'bg-red-100'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-400',
    iconBg: 'bg-blue-100'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-400',
    iconBg: 'bg-yellow-100'
  }
}

const styles = typeStyles[props.type]
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      :class="[
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md',
        styles.bg,
        styles.border
      ]"
    >
      <div :class="['flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', styles.iconBg]">
        <!-- Success Icon -->
        <svg v-if="type === 'success'" :class="['w-5 h-5', styles.icon]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <!-- Error Icon -->
        <svg v-else-if="type === 'error'" :class="['w-5 h-5', styles.icon]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <!-- Info Icon -->
        <svg v-else-if="type === 'info'" :class="['w-5 h-5', styles.icon]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <!-- Warning Icon -->
        <svg v-else :class="['w-5 h-5', styles.icon]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <div class="flex-1 min-w-0">
        <p :class="['text-sm font-semibold', styles.text]">{{ title }}</p>
        <p v-if="description" :class="['text-sm mt-1', styles.text, 'opacity-80']">{{ description }}</p>
      </div>
      
      <button
        @click="closeToast"
        :class="['flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors', styles.text]"
        aria-label="Close"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
