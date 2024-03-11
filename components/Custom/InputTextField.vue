<script setup lang="ts">
import { useField } from "vee-validate";

type CustomProps = {
  name: string;
  label?: string;
  helpText?: string;
  placeholder?: string;
  disabled?: boolean;
};

const props = defineProps<CustomProps>();
const { value, errorMessage } = useField<any>(() => props.name);
</script>

<template>
  <div class="tw-flex tw-flex-col tw-gap-2">
    <label :for="props.name" class="tw-text-sm tw-text-blue-900">{{
      props.label
    }}</label>
    <InputText :id="props.name" type="text" v-model="value" v-bind="props" />
    <small v-if="props.helpText" :id="`${props.name}-help`">{{
      props.helpText
    }}</small>
    <small
      v-if="errorMessage"
      :id="`${props.name}-error`"
      class="tw-text-red-500"
      >{{ errorMessage }}</small
    >
  </div>
</template>
