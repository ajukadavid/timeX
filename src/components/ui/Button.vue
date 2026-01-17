<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'solid' | 'outline' | 'ghost' | 'soft'
  color?: 'primary' | 'gray' | 'red' | 'green' | 'blue'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'solid',
  color: 'primary',
  size: 'md',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const variantClasses = {
  solid: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    gray: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    red: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    green: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    blue: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
  },
  outline: {
    primary: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    gray: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
    red: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    green: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    blue: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  },
  ghost: {
    primary: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    gray: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
    red: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
    green: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
    blue: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  },
  soft: {
    primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200 focus:ring-primary-500',
    gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    red: 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500',
    green: 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500',
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500'
  }
}

const classes = computed(() => [
  baseClasses,
  sizeClasses[props.size],
  variantClasses[props.variant][props.color]
].join(' '))
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>
