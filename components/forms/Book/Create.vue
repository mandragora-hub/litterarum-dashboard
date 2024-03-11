<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import validationUtils from "@/utils/validationUtils";
import type {
  IHttpSuccessResponse,
  IHttpPostDataResponse,
  IBook,
  IFile,
  ITag,
  IAuthor,
} from "~/types";

const props = defineProps<{
  onCreated?: () => {};
}>();

const emit = defineEmits(["close", "created"]);
const close = () => emit("close");

const config = useRuntimeConfig();

const { data: pdfFiles, pending: loadingPdfFiles } =
  useApiFetch<IHttpSuccessResponse<[IFile]>>("api/v1/files");

const { data: authors, pending: loadingAuthors } =
  useApiFetch<IHttpSuccessResponse<[IAuthor]>>("api/v1/authors");

const { data: tags, pending: loadingTags } =
  useApiFetch<IHttpSuccessResponse<[ITag]>>("api/v1/tags");

const { handleSubmit, setValues } = useForm<IBook>({
  initialValues: {
    title: "",
    subtitle: "",
    description: "",
    // basename: "",
    coverUrl: "",
    readTime: 0,
    wordCount: 0,
    pages: 0,
    downloaded: 0,
    views: 0,
    author: "",
    tags: [],
    pdfFile: "",
    // ePubFile?: string;
    publicationDate: "", // 431-213 BC, 1982
    isbn: "",
  },
  validationSchema: toTypedSchema(validationUtils.generics.bookSchema()),
});

const onSubmit = handleSubmit(async (values: IBook) => {
  values.pdfFile = `https://litterarum.onrender.com/api/v1/files/${values.pdfFile}`
  console.log(values);

  await $fetch<IHttpSuccessResponse<IHttpPostDataResponse>>("api/v1/books", {
    baseURL: config.public.apiUrl,
    method: "POST",
    body: values,
    headers: {
      Authorization: `Basic ${config.token}`,
    },
    onResponse: () => {
      emit("created");
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
      <TabView
        :scrollable="true"
        :pt="{
          panelContainer: { class: 'tw-px-1' },
          navContent: { class: 'tw-text-sm' },
        }"
      >
        <TabPanel header="General">
          <div class="tw-flex tw-flex-col tw-gap-y-6 tw-my-2">
            <CustomInputTextField
              name="title"
              label="Title"
              placeholder="Write the book title"
            />
            <CustomInputTextField
              name="coverUrl"
              label="Cover URL"
              placeholder="URL to cover the book"
            />
            <div class="tw-flex tw-items-end tw-gap-x-2">
              <CustomDropdownField
                class="tw-w-full"
                name="author"
                label="Author"
                placeholder="Select author from the list"
                :options="authors ? authors.data : undefined"
                optionLabel="name"
                optionValue="_id"
                :loading="loadingAuthors"
              />
              <Button class="tw-h-10" icon="pi pi-plus" outlined />
            </div>
            <CustomInputTextField
              name="publicationDate"
              label="Publication date"
              placeholder="Date of publication"
            />
            <div class="tw-flex tw-gap-2">
              <CustomInputNumberField
                class="tw-w-full"
                name="views"
                label="Views"
                disabled
              />
              <CustomInputNumberField
                class="tw-w-full"
                name="downloaded"
                label="Downloaded"
                disabled
              />
            </div>
            <CustomInputTextField name="isbn" label="ISBN" placeholder="ISBN" />
            <CustomTextareaField
              name="description"
              label="Description"
              placeholder="Book description"
            />
          </div>
        </TabPanel>
        <TabPanel header="PDF Selector">
          <div class="tw-flex tw-flex-col tw-gap-y-6 tw-my-2">
            <CustomDropdownField
              name="pdfFile"
              label="PDF Select"
              placeholder="Select PDF files"
              :options="pdfFiles ? pdfFiles.data : undefined"
              optionLabel="basename"
              optionValue="basename"
              :loading="loadingPdfFiles"
            />
            <Button label="Get Metadata" />
            <div class="tw-flex tw-gap-2">
              <CustomInputNumberField
                class="tw-w-full"
                name="pages"
                label="Pages"
                placeholder="Number of pages"
              />
              <CustomInputNumberField
                class="tw-w-full"
                name="readTime"
                label="Read Time"
                placeholder="Read time in milliseconds"
              />
            </div>
            <CustomInputNumberField
              class="tw-w-full"
              name="wordCount"
              label="Word Count"
              placeholder="How many words in pdf file"
            />
          </div>
        </TabPanel>
        <TabPanel header="Tags">
          <div class="tw-flex tw-justify-end">
            <Button label="Create New Tag" size="small" />
          </div>
          <CustomPickListField
            name="tags"
            label="Tags"
            dataKey="_id"
            placeholder="How many words in pdf file"
            :options="tags?.data"
            :loading="loadingTags"
            options-label="tag"
          />
        </TabPanel>
      </TabView>
      <Divider />
      <div class="tw-flex tw-justify-end tw-gap-x-2">
        <Button label="Cancel" text size="small" @click="close" />
        <Button label="Create" size="small" type="submit" />
      </div>
    </form>
  </div>
</template>
