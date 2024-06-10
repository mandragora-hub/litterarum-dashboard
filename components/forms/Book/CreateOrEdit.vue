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
  editBook?: IBook;
}>();

const emit = defineEmits(["close", "created", "updated"]);
const close = () => emit("close");

const modal = useModal();
const createAuthor = () => {
  modal.openForm(
    "CreateOrEditAuthor",
    {
      onCreated: executeAuthors,
    },
    {
      title: `Create a new Author`,
      description: "Create a new Author for the virtual library",
    }
  );
};

const isEditMode = computed(() => (props.editBook ? true : false));

const config = useRuntimeConfig();
const pdfFiles = ref<string[]>();
const { pending: loadingPdfFiles } = useApiFetch<[string]>("api/v1/files", {
  onResponse: (r) => {
    const array = r.response._data.data as [IFile];
    const files = array.map(
      (el) => `https://litterarum.onrender.com/api/v1/files/${el.basename}`
    );
    pdfFiles.value = files;
  },
});

const {
  data: authors,
  pending: loadingAuthors,
  execute: executeAuthors,
} = useApiFetch<IHttpSuccessResponse<[IAuthor]>>("api/v1/authors");

const { data: tags, pending: loadingTags } =
  useApiFetch<IHttpSuccessResponse<[ITag]>>("api/v1/tags");

const editBookAuthor = computed(() => ({
  // @ts-expect-error
  author: props.editBook ? props.editBook.author._id : "",
}));

const { handleSubmit, setValues, values } = useForm<IBook>({
  initialValues: {
    title: "",
    // subtitle: "",
    description: "",
    // basename: "",
    coverUrl: "",
    readTime: 0,
    wordCount: 0,
    pages: 0,
    downloaded: 0,
    tags: [],
    views: 0,
    pdfFile: "",
    // ePubFile?: string;
    publicationDate: "", // 431-213 BC, 1982
    isbn: undefined,
    ...props.editBook,
    ...editBookAuthor.value,
  },
  validationSchema: toTypedSchema(validationUtils.generics.bookSchema()),
});
const onSubmit = handleSubmit(async (values: IBook) => {
  const urlFixed = isEditMode.value
    ? `api/v1/books/${values._id}`
    : "api/v1/books";
  await $fetch<IHttpSuccessResponse<IHttpPostDataResponse>>(urlFixed, {
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
  });
});

const { pending: loadingMetadata, execute: getMetadata } =
  await useLazyAsyncData(() => {
    if (!values.pdfFile) return Promise.resolve();
    return $fetch(`metadata/?url=${values.pdfFile}`, {
      baseURL: config.public.metadataExtractorUrl,
      method: "GET",
      immediate: false,
      server: false,
      timeout: 500 * 1000, // 500s timeout
      onResponse: (r) => {
        const { pages, wordCount, readTime, metadata } = r.response._data;
        setValues({
          pages,
          wordCount,
          readTime,
        });
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
                filter
              />
              <Button
                class="tw-h-10"
                icon="pi pi-plus"
                outlined
                @click="createAuthor"
              />
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
              :options="pdfFiles ? pdfFiles : undefined"
              :loading="loadingPdfFiles"
              :virtualScrollerOptions="{ itemSize: 38 }"
              filter
            />
            <Button
              label="Get Metadata"
              @click="getMetadata()"
              :loading="loadingMetadata"
            />
            <Message severity="warn"
              >Get metadata could be a expensive operation and It may take a
              long time to respond.</Message
            >
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
            placeholder="Select books tags"
            :options="tags?.data"
            :loading="loadingTags"
            options-label="tag"
          />
        </TabPanel>
      </TabView>
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
