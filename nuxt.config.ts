// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  alias: {
    'class-validator': 'class-validator/cjs/index.js',
  },
  modules: ['@nuxt/ui'],
  pages: true
})
