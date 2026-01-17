<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'gray'
  variant?: 'outline' | 'filled'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  color: 'primary',
  variant: 'outline'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg'
}

const variantClasses = {
  outline: {
    primary: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-500',
    gray: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-gray-500'
  },
  filled: {
    primary: 'bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-500',
    gray: 'bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-gray-500'
  }
}

const classes = computed(() => [
  'block w-full rounded-lg border-0 transition-colors placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75',
  sizeClasses[props.size],
  variantClasses[props.variant][props.color]
].join(' '))
</script>

<template>
  <div class="relative">
    <input
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="classes"
    />
    <slot />
  </div>
</template>
