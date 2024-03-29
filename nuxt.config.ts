import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      token: process.env.BACKEND_REST_API_TOKEN,
      apiUrl: process.env.BACKEND_REST_API_URL,
      metadataExtractorUrl: process.env.METADATA_EXTRACTOR_URL,
    },
    githubClientId: process.env.GITHUB_ID,
    githubClientSecret: process.env.GITHUB_SECRET,
    authSecret: process.env.AUTH_SECRET,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@sidebase/nuxt-auth",
  ],
  auth: {
    baseURL: "http://localhost:3000/api/auth",
    globalAppMiddleware: true,
    provider: { type: "authjs" },
  },
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
