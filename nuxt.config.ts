import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    "/": { redirect: "books" },
  },
  runtimeConfig: {
    public: {
      apiUrl: `${process.env.BACKEND_REST_API_URL}`,
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/image",
  ],
  primevue: {
    importPT: {
      as: "MyCustomPreset",
      from: path.resolve(__dirname, "./assets/presets/global.ts"),
    },
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
  },
  css: [
    "primevue/resources/themes/aura-light-noir/theme.css",
    // "primevue/resources/themes/aura-light-blue/theme.css",
    "@/assets/css/tailwind.css",
    "primeicons/primeicons.css",
  ],
});
