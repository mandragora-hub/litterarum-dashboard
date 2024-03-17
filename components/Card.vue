<script setup lang="ts">
withDefaults(defineProps<{ loading: boolean }>(), {
  loading: false,
});
</script>
<template>
  <div class="tw-p-4 tw-border tw-rounded tw-w-max tw-shadow-lg">
    <slot name="header" />
    <slot name="loading" v-if="$props.loading">
      <div class="tw-p-4">
        <ProgressSpinner class="tw-mx-auto tw-w-full tw-h-14" strokeWidth="4" />
      </div>
    </slot>
    <slot name="body" />
  </div>
</template>
