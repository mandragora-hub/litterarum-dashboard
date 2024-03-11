<script setup lang="ts">
import { useField } from "vee-validate";
type CustomProps = {
  name: string;
  label: string;
  helpText?: string;
  checkedValue?: any;
  uncheckedValue?: any;
};

const props = withDefaults(defineProps<CustomProps>(), {
  checkedValue: true,
  uncheckedValue: false,
});

const {
  checked: initialValue,
  errorMessage,
  handleChange,
} = useField<any>(() => props.name, undefined, {
  type: "checkbox",
  checkedValue: props.checkedValue,
  uncheckedValue: props.uncheckedValue,
});

const checkboxChecked = ref<boolean | undefined>(initialValue?.value);

const handleCheckboxChange = () => {
  handleChange(
    checkboxChecked.value ? props.checkedValue : props.uncheckedValue
  );
};
</script>

<template>
  <div class="tw-flex tw-gap-2 tw-items-center">
    <Checkbox
      :id="props.name"
      v-model="checkboxChecked"
      @change="handleCheckboxChange"
      :binary="true"
      :name="props.name"
      :inputId="props.name"
    />
    <label
      :for="props.name"
      class="tw-text-sm tw-text-blue-900 tw-select-none"
      >{{ props.label }}</label
    >

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
