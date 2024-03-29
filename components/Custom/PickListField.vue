<script setup lang="ts">
import type { PickListProps } from "primevue/picklist";
import { useField } from "vee-validate";
type CustomProps = {
  name: string;
  label?: string;
  helpText?: string;
  options?: any[];
  optionsLabel: string;
} & Omit<PickListProps, "modelValue">;
const props = defineProps<CustomProps>();

const { value, errorMessage } = useField<[any]>(() => props.name);
const picklistValue = ref();

watch(
  () => props.options,
  () => {
    if (!props.options) return;
    const availableArray = [];
    for (const option of props.options) {
      if (!value.value.some((el) => el._id === option._id)) {
        availableArray.push(option);
      }
    }

    picklistValue.value = [availableArray, value.value];
  }
);

watch(
  () => picklistValue.value,
  () => {
    value.value = picklistValue.value[1];
  }
);
</script>

<template>
  <div class="tw-flex tw-flex-col tw-gap-2">
    <label :for="props.name" class="tw-text-sm tw-text-blue-900">{{
      props.label
    }}</label>
    <PickList :id="props.name" v-model="picklistValue" v-bind="props">
      <template #sourceheader>Available</template>
      <template #targetheader>Selected</template>
      <template #item="slotProps">
        <span>{{ slotProps.item[optionsLabel] }}</span>
      </template>
    </PickList>

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
