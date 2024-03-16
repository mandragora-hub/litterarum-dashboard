<script setup lang="ts">
import type { IHttpSuccessResponse, IBook } from "~/types";
import { FilterMatchMode } from "primevue/api";

const config = useRuntimeConfig();
const modal = useModal();
const confirm = useConfirm();
const toast = useToast();

const {
  data: books,
  pending,
  execute,
} = useApiFetch<IHttpSuccessResponse<[IBook]>>("api/v1/books");

const selectedBooks = ref<[IBook]>();

const columns = [
  { field: "title", sortable: true, header: "Title" },
  { field: "slug", header: "Slug" },
  // { field: "subtitle", header: "Subtitle" },
  // { field: "description", header: "Description" },
  // { field: "readTime", header: "ReadTime" },
  // { field: "wordCount", header: "WordCount" },
  { field: "pages", header: "Pages" },
  { field: "downloaded", header: "Downloaded" },
  { field: "views", header: "Views" },
  { field: "createdAt", header: "Created at" },
  { field: "updatedAt", header: "Updated at" },
];

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const clearFilter = () => {
  filters.value.global.value = null;
};

const confirmDeleteBook = (bookId: string) => {
  confirm.require({
    header: "Confirmation",
    message: "Do you want to delete this record?",
    icon: "pi pi-info-circle",
    rejectClass: "p-button-secondary p-button-outlined p-button-sm",
    acceptClass: "p-button-danger p-button-sm",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    accept: async () => deleteBook(bookId),
  });
};

const deleteSelect = () => {};

const deleteBook = async (bookId: string) => {
  await $fetch(`api/v1/books/${bookId}`, {
    baseURL: config.public.apiUrl,
    method: "DELETE",
    headers: {
      Authorization: `Basic ${config.public.token}`,
    },
    onResponse: () => {
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "Record deleted",
      });
      execute();
    },
    onResponseError: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "Error on delete record",
      });
    },
  });
};

const handleEditButton = (book: IBook) => {
  modal.openForm(
    "CreateOrEditBook",
    {
      editBook: book,
      onUpdated: execute,
    },
    {
      title: "Edit book",
      description: "Edit book",
    }
  );
};

const handleCreateButton = () => {
  modal.openForm(
    "CreateOrEditBook",
    {
      onCreated: execute,
    },
    {
      title: `Create a new book`,
      description: "Create a new book for the virtual library",
    }
  );
};

useSeoMeta({
  title: "Books",
  description: "Descripción de la pagina.",
});
</script>

<template>
  <div class="tw-p-8">
    <div class="tw-flex tw-items-center">
      <h1 class="tw-text-primary-100 tw-font-bold tw-text-2xl tw-grow">
        Books
      </h1>
      <div class="tw-flex tw-gap-x-4">
        <Button
          label="Crear Nuevo"
          icon="pi pi-plus"
          size="small"
          @click="handleCreateButton"
        />
        <Button outlined icon="pi pi-print" size="small" />
      </div>
    </div>
    <Divider />
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedBooks"
      :globalFilterFields="['title']"
      dataKey="_id"
      filterDisplay="row"
      :value="books?.data"
      :loading="pending"
      stripedRows
      paginator
      :rows="30"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :pt="{ header: 'tw-px-0' }"
    >
      <template #header>
        <div class="tw-flex tw-justify-between tw-py-2">
          <div class="tw-flex tw-gap-x-2">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              outlined
              @click="clearFilter"
            />
            <Button
              v-if="selectedBooks && selectedBooks.length > 0"
              type="button"
              icon="pi pi-trash"
              severity="danger"
              :label="`Delete (${selectedBooks.length})`"
              outlined
              @click="deleteSelect"
            />
          </div>
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </IconField>
        </div>
      </template>
      <template #empty> No customers found. </template>
      <Column selectionMode="multiple"></Column>
      <Column header="Cover">
        <template #body="slotProps">
          <NuxtImg
            :src="slotProps.data.coverUrl || 'image-break.png'"
            class="tw-w-10 tw-rounded"
            width="1em"
            height="1em"
          />
        </template>
      </Column>
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable"
      ></Column>
      <Column header="Action">
        <template #body="slotProps">
          <div class="tw-flex tw-gap-x-4">
            <Button
              icon="pi pi-file-edit"
              outlined
              @click="handleEditButton(slotProps.data)"
            />
            <Button icon="pi pi-eye" outlined />
            <Button
              icon="pi pi-trash"
              outlined
              severity="danger"
              @click="confirmDeleteBook(slotProps.data._id)"
            />
          </div>
        </template>
      </Column>
      <template #loading> Loading customers data. Please wait. </template>
      <template #footer>
        In total there are {{ books ? books.data.length : 0 }} books.
      </template>
    </DataTable>
  </div>
</template>
