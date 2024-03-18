<script setup lang="ts">
import type { IHttpSuccessResponse, IFile } from "~/types";
import { FilterMatchMode } from "primevue/api";

const config = useRuntimeConfig();
const modal = useModal();
const confirm = useConfirm();
const toast = useToast();

const {
  data: files,
  pending,
  execute,
} = useApiFetch<IHttpSuccessResponse<[IFile]>>("api/v1/files");

const selectedBooks = ref<[IFile]>();

const columns = [
  { field: "basename", sortable: true, header: "Basename" },
  { field: "lastmod", sortable: true, header: "Lastmod" },
  { field: "size", sortable: true, header: "Size" },
  { field: "type", sortable: true, header: "Type" },
  { field: "mime", sortable: true, header: "Mime" },
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
  // await $fetch(`api/v1/books/${bookId}`, {
  //   baseURL: config.public.apiUrl,
  //   method: "DELETE",
  //   headers: {
  //     Authorization: `Basic ${config.public.token}`,
  //   },
  //   onResponse: () => {
  //     toast.add({
  //       severity: "info",
  //       summary: "Confirmed",
  //       detail: "Record deleted",
  //     });
  //     execute();
  //   },
  //   onResponseError: () => {
  //     toast.add({
  //       severity: "error",
  //       summary: "Rejected",
  //       detail: "Error on delete record",
  //     });
  //   },
  // });
};

const handleUploadButton = () => {
  modal.openForm(
    "UploadFile",
    {
      onUploaded: execute,
    },
    {
      title: `Upload files`,
      description: "Upload PDF file to our cloud server",
    }
  );
};

useSeoMeta({
  title: "Files",
  description: "List of all pdf files that are available in our cloud storage.",
});
</script>

<template>
  <Page
    name="Files"
    description="List of all pdf files that are available in our cloud storage"
  >
    <template #buttons>
      <Button
        label="Add new file"
        icon="pi pi-plus"
        size="small"
        @click="handleUploadButton"
      />
    </template>
    <template #body>
      <DataTable
        v-model:filters="filters"
        v-model:selection="selectedBooks"
        :globalFilterFields="['basename']"
        dataKey="_id"
        filterDisplay="row"
        :value="files?.data"
        :loading="pending"
        stripedRows
        paginator
        :rows="10"
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
        <template #empty>No files found.</template>
        <Column selectionMode="multiple"></Column>
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
              <NuxtLink
                :to="`https://litterarum.onrender.com/api/v1/files/${slotProps.data.basename}`"
                target="_blank"
                rel="noopener"
              >
                <Button icon="pi pi-external-link" outlined />
              </NuxtLink>
              <Button
                icon="pi pi-trash"
                outlined
                severity="danger"
                @click="confirmDeleteBook(slotProps.data._id)"
              />
            </div>
          </template>
        </Column>
        <template #footer>
          In total there are {{ files ? files.data.length : 0 }} files.
        </template>
      </DataTable>
    </template>
  </Page>
</template>
