<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import validationUtils from "@/utils/validationUtils";
import type {
  IHttpSuccessResponse,
  IHttpPostDataResponse,
  IAuthor,
} from "~/types";

const props = defineProps<{
  editAuthor?: IAuthor;
}>();

const emit = defineEmits(["close", "created", "updated"]);
const close = () => emit("close");

const isEditMode = computed(() => (props.editAuthor ? true : false));

const config = useRuntimeConfig();
const { handleSubmit } = useForm<IAuthor>({
  initialValues: {
    name: "",
    alias: undefined,
    photoUrl: "",
    biography: undefined,
    ...props.editAuthor,
    _id: undefined,
  },
  validationSchema: toTypedSchema(validationUtils.generics.authorSchema()),
});

const onSubmit = handleSubmit(async (values: IAuthor) => {
  await $fetch<IHttpSuccessResponse<IHttpPostDataResponse>>(
    `api/v1/authors/${isEditMode.value ? props.editAuthor?._id : ""}`,
    {
      baseURL: config.public.apiUrl,
      method: isEditMode.value ? "PUT" : "POST",
      body: values,
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
    }
  );
});
</script>

<template>
  <div class="tw-py-2">
    <!-- <ProgressSpinner class="tw-mx-auto tw-w-full" v-if="loadingParent" /> -->
    <form @submit.prevent="onSubmit">
      <div class="tw-flex tw-flex-col tw-gap-y-6 tw-my-2">
        <CustomInputTextField
          name="name"
          label="Name"
          placeholder="Author name"
        />
        <CustomInputTextField
          name="photoUrl"
          label="Photo URL"
          placeholder="Photo URL"
        />
        <CustomTextareaField
          name="biography"
          label="Biography"
          placeholder="Brief description about the author's life"
        />
      </div>
      <Divider />
      <div class="tw-flex tw-justify-end tw-gap-x-2">
        <Button label="Cancel" text size="small" @click="close" />
        <Button
          :label="isEditMode ? 'Edit' : 'Create'"
          size="small"
          type="submit"
        />
      </div>
    </form>
  </div>
</template>
