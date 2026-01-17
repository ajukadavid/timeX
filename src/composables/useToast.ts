export const useToast = () => {
  const toast = inject<{
    add: (toast: {
      id: string
      title: string
      description?: string
      type?: 'success' | 'error' | 'info' | 'warning'
      timeout?: number
    }) => void
    remove: (id: string) => void
  }>('toast')

  if (!toast) {
    console.warn('useToast must be used within a Toaster component')
    return {
      add: () => {},
      remove: () => {}
    }
  }

  return toast
}
