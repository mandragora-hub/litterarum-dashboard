<script setup lang="ts">
const props = defineProps<{ name?: string; description?: string }>();
</script>

<template>
  <div class="tw-p-8">
    <slot name="header">
      <div class="tw-flex tw-items-center">
        <div class="tw-grow">
          <h1 class="tw-font-bold tw-text-2xl">
            {{ props.name }}
          </h1>
          <small v-if="props.description" class="tw-text-gray-500">{{
            props.description
          }}</small>
        </div>
        <div class="tw-flex tw-gap-x-4">
          <slot name="buttons"></slot>
          <Button outlined icon="pi pi-print" size="small" />
        </div>
      </div>
    </slot>
    <Divider />
    <slot name="body" />
  </div>
</template>
