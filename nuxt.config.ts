// https://nuxt.com/docs/api/configuration/nuxt-config
/// <reference types="nuxt" />
export default defineNuxtConfig({
  app: {
    head: {
      title: "TimeX | Your HR Management Tool",
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      meta: [
        {
          name: "description",
          content:
            "TimeX is a HR management tool that helps you manage your employees' time and attendance, leaves, and payroll.",
        },
        {
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
    "@nuxt/devtools",
    "@pinia/nuxt",
  ],
  pages: true,
  compatibilityDate: "2026-01-16",
  devtools: {
    // Disable devtools in production to save memory
    enabled: import.meta.dev,
  },
  icon: {
    serverBundle: {
      collections: ["heroicons", "simple-icons"],
    },
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    prerender: {
      crawlLinks: false,
    },
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },
  build: {
    transpile: ["@nuxt/ui"],
  },
});
