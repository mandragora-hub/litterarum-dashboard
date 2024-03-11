<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<template>
  <div class="tw-mt-20 tw-flex tw-flex-col tw-items-center tw-gap-y-6">
    <Avatar
      icon="pi pi-globe"
      class="tw-w-48 tw-h-48"
      shape="circle"
      :pt="{
        root: { class: 'tw-bg-neutral-100' },
        icon: { class: 'tw-text-7xl tw-text-neutral-400' },
      }"
    />
    <span
      class="tw-text-pretty tw-text-2xl tw-font-medium tw-text-center tw-text-neutral-600 tw-w-1/4"
    >
      {{ message }}
    </span>
    <slot />
  </div>
</template>
