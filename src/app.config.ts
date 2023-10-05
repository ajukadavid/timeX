export default defineAppConfig({
    ui: {
        strategy: 'override',
        primary: "blueZodiac",
        gray: "cool",
        notifications: {
            // Show toasts at the top right of the screen
            position: "top-0 right-0",
        },
        button: {
      color: {
        white: {
          solid: 'bg-blueZodiac text-white dark:border-blueZodiac-400 dark:border dark:bg-blueZodiac-600',
          
        }
      }
    }

    },
});
