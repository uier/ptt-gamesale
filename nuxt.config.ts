// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    shim: false,
  },
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/supabase",
    "nuxt-icon",
    "dayjs-nuxt",
  ],
});
