<template>
  <div class="tw-p-8 tw-text-center">
    <h1 class="tw-text-4xl">Welcome back</h1>
    <p class="tw-mb-4">Select a provider for sign-in to the dashboard</p>

    <p>Sign-In Options:</p>
    <Button
      class="tw-w-full"
      icon="pi pi-github"
      label="Sign in with Github"
      @click="signIn('github')"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "login",
  auth: {
    unauthenticatedOnly: true,
  },
});

const { signIn } = useAuth();
</script>
