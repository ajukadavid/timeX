// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",
  alias: {
    "class-validator": "class-validator/cjs/index.js",
  },
  modules: ["@nuxt/ui", "@nuxtjs/eslint-module", "@nuxt/devtools"],
  ui: {
    global: true,
    icons: ["mdi", "line-md", "simple-icons", "heroicons", "material-icons"],
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
