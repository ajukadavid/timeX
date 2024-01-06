// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "TimeX | Your HR Management Tool",
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "TimeX is a HR management tool that helps you manage your employees' time and attendance, leaves, and payroll.",
        },
        {
          hid: "viewport",
          name: "viewport",
          content: "width=device-width,initial-scale=1.0",
        },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  srcDir: "src/",
  alias: {
    "class-validator": "class-validator/cjs/index.js",
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/eslint-module",
    "@nuxt/devtools",
    "@pinia/nuxt",
  ],
  ui: {
    global: true,
    icons: ["line-md", "mdi", "heroicons"],
    // icons: "all",
  },
  pages: true,
  eslint: {
    lintOnStart: false,
  },
  devtools: {
    // Enable devtools (default: true)
    enabled: true,
    // VS Code Server options
    vscode: {},
    // ...other options
  },
});
