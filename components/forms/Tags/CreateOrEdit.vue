<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import validationUtils from "@/utils/validationUtils";
import type {
  IHttpSuccessResponse,
  IHttpPostDataResponse,
  ITag,
} from "~/types";

const props = defineProps<{
  editTag?: ITag;
}>();

const emit = defineEmits(["close", "created", "updated"]);
const close = () => emit("close");
const isEditMode = computed(() => (props.editTag ? true : false));

const config = useRuntimeConfig();
const { handleSubmit } = useForm<ITag>({
  initialValues: {
    tag: "",
    ...props.editTag,
  },
  validationSchema: toTypedSchema(validationUtils.generics.tagSchema()),
});

const onSubmit = handleSubmit(async (values: ITag) => {
  const urlTags = !isEditMode.value
    ? "api/v1/tags"
    : `api/v1/tags/${values._id}`;

  await $fetch<IHttpSuccessResponse<IHttpPostDataResponse>>(urlTags, {
    baseURL: config.public.apiUrl,
    method: isEditMode.value ? "PUT" : "POST",
    body: { ...values, _id: undefined },
    headers: {
      Authorization: `Basic ${config.public.token}`,
    },
    onResponse: () => {
      isEditMode.value ? emit("updated") : emit("created");
      close();
    },
    onResponseError: (r: any) => {
      console.error("error", r.response);
      alert(JSON.stringify(r.response._data, null, 2));
    },
  });
});
</script>

<template>
  <div class="tw-py-2">
    <!-- <ProgressSpinner class="tw-mx-auto tw-w-full" v-if="loadingParent" /> -->
    <form @submit.prevent="onSubmit">
      <div class="tw-flex tw-flex-col tw-gap-y-6 tw-my-2">
        <CustomInputTextField
          name="tag"
          label="SysTag"
          placeholder="Tag name"
        />
      </div>
      <Divider />
      <div class="tw-flex tw-justify-end tw-gap-x-2">
        <Button label="Cancel" text size="small" @click="close" />
        <Button label="Create" size="small" type="submit" />
      </div>
    </form>
  </div>
</template>
