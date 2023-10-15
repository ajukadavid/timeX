export default defineAppConfig({
  ui: {
    strategy: "override",
    primary: "blueZodiac",
    gray: "zinc",
    notifications: {
      // Show toasts at the top right of the screen
      position: "top-0 right-0",
    },
    button: {
      default: {
        color: "white",
        loadingIcon: "i-mdi-loading",
      },
      color: {
        white: {
          solid:
            "bg-blueZodiac text-white hover:bg-blueZodiac-800 dark:ring-2 dark:ring-blueZodiac-400 dark:bg-transparent dark:hover:bg-blueZodiac-400 dark:text-blueZodiac-400 dark:hover:text-black",
        },
      },
      size: {
        lg: "px-8 py-3 lg:max-w-[150px] w-full justify-center text-base",
      },
    },
    formGroup: {
      label: {
        base: "block font-medium text-black dark:text-white",
      },
    },
  },
});
