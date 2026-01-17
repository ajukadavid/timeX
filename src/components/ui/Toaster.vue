<script setup lang="ts">
interface Toast {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

const toasts = ref<Toast[]>([])

const addToast = (toast: Toast) => {
  toasts.value.push(toast)
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Provide toast functionality globally
provide('toast', {
  add: addToast,
  remove: removeToast
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :id="toast.id"
        :title="toast.title"
        :description="toast.description"
        :type="toast.type"
        :timeout="toast.timeout"
        @close="removeToast"
        class="pointer-events-auto"
      />
    </div>
  </Teleport>
</template>
