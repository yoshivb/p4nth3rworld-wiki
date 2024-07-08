// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },

  devtools: { enabled: true },
  modules: ["@nuxt/content", "@nuxt/ui", "@nuxtjs/tailwindcss", "@nuxt/icon"],
  compatibilityDate: "2024-07-04",
});