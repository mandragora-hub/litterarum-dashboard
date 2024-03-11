<script setup lang="ts">
const app = useAppConfig();
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${app.title}` : `${app.title}`;
  },
  meta: [{ name: "description", content: `${app.description}` }],
});
</script>

<template>
  <Toast />
  <NuxtLoadingIndicator color="lightblue" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <DynamicDialog />
</template>
