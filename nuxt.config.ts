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
  modules: ["@formkit/auto-animate/nuxt", "@nuxt/content", "@nuxt/image", "@nuxt/ui"],
  compatibilityDate: "2024-07-04",
});