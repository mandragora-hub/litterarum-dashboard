<script setup lang="ts">
import { useField } from "vee-validate";
type CustomProps = {
  name: string;
  helpText?: string;
  checkedLabel: string;
  uncheckedLabel: string;
  checkedValue?: any;
  uncheckedValue?: any;
};

const props = withDefaults(defineProps<CustomProps>(), {
  checkedValue: true,
  uncheckedValue: false,
});

const normalizeLabel = computed(() => {
  const string = checkboxChecked.value
    ? props.checkedLabel
    : props.uncheckedLabel;
  return string.toLowerCase();
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

watch(
  () => checkboxChecked.value,
  () =>
    handleChange(
      checkboxChecked.value ? props.checkedValue : props.uncheckedValue
    )
);

const toggleValue = () => (checkboxChecked.value = !checkboxChecked.value);
</script>

<template>
  <div class="tw-flex tw-gap-2 tw-w-min tw-cursor-pointer tw-group">
    <InputSwitch
      :id="props.name"
      v-model="checkboxChecked"
      :name="props.name"
      class="group-hover:tw-drop-shadow"
    />
    <label
      :for="props.name"
      class="tw-capitalize group-hover:tw-text-blue-900 group-hover:tw-drop-shadow tw-cursor-pointer tw-select-none"
      @click="toggleValue"
      >{{ normalizeLabel }}</label
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
