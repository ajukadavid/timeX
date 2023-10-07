export default defineAppConfig({
  ui: {
    strategy: "override",
    primary: "blueZodiac",
    gray: "cool",
    notifications: {
      // Show toasts at the top right of the screen
      position: "top-0 right-0",
    },
    button: {
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
  },
});
