<script setup lang="ts">
definePageMeta({
  layout: "login",
  auth: {
    unauthenticatedOnly: true,
  },
});

const { signIn } = useAuth();
const username = ref(undefined);
const password = ref("");
</script>
<template>
  <div class="tw-p-8">
    <h1 class="tw-text-4xl">Welcome back</h1>
    <p class="tw-mb-8">Select a provider for sign-in to the dashboard</p>
    <div class="tw-flex tw-flex-col tw-gap-y-8">
      <FloatLabel>
        <InputText class="tw-w-full" id="username" v-model="username" />
        <label for="username">Username</label>
      </FloatLabel>

      <FloatLabel>
        <InputText class="tw-w-full" type="password" v-model="password" />
        <label for="password">Password</label>
      </FloatLabel>
      <Button class="tw-w-full" label="Login" />
    </div>

    <Divider align="center">
      <p>Sign-In Options:</p>
    </Divider>
    <Button
      class="tw-w-full"
      icon="pi pi-github"
      outlined
      label="Sign in with Github"
      @click="signIn('github')"
    />
  </div>
</template>
