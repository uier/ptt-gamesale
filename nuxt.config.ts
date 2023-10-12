// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    shim: false,
  },
  build: {
    transpile: [/echarts/],
  },
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/supabase",
    "nuxt-icon",
    "dayjs-nuxt",
    "@vueuse/nuxt",
  ],
  dayjs: {
    locales: ["zh-tw"],
    plugins: ["relativeTime", "timezone"],
    defaultLocale: "zh-tw",
    defaultTimezone: "Asia/Taipei",
  },
});
