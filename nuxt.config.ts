// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    srcDir: "src/",
    alias: {
        "class-validator": "class-validator/cjs/index.js",
    },
    modules: ["@nuxt/ui"],
    ui: {
        global: true,
        icons: ["mdi", "simple-icons", "heroicons", "material-icons"],
    },
    pages: true,
});
