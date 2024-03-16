<script setup lang="ts">
import type { IHttpSuccessResponse, IAuthor } from "~/types";
import { FilterMatchMode } from "primevue/api";

const config = useRuntimeConfig();
const modal = useModal();
const confirm = useConfirm();
const toast = useToast();

const {
  data: authors,
  pending,
  execute,
} = useApiFetch<IHttpSuccessResponse<[IAuthor]>>("api/v1/authors");

const selectedAuthors = ref<[IAuthor]>();

const columns = [{ field: "name", sortable: true, header: "Name" }];

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const clearFilter = () => {
  filters.value.global.value = null;
};

const confirmDeleteAuthor = (authorId: string) => {
  confirm.require({
    header: "Confirmation",
    message: "Do you want to delete this record?",
    icon: "pi pi-info-circle",
    rejectClass: "p-button-secondary p-button-outlined p-button-sm",
    acceptClass: "p-button-danger p-button-sm",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    accept: async () => deleteAuthor(authorId),
  });
};

const deleteSelect = () => {};

const deleteAuthor = async (authorId: string) => {
  await $fetch(`api/v1/authors/${authorId}`, {
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

const handleEditButton = (author: IAuthor) => {
  modal.openForm(
    "CreateOrEditAuthor",
    {
      editAuthor: author,
      onUpdated: execute,
    },
    {
      title: "Edit author",
      description: "Edit author",
    }
  );
};

const handleCreateButton = () => {
  modal.openForm(
    "CreateOrEditAuthor",
    {
      onCreated: execute,
    },
    {
      title: `Create a new Author`,
      description: "Create a new Author for the virtual library",
    }
  );
};

useSeoMeta({
  title: "Authors",
  description: "Authors pages description here.",
});
</script>

<template>
  <div class="tw-p-8">
    <div class="tw-flex tw-items-center">
      <h1 class="tw-text-primary-100 tw-font-bold tw-text-2xl tw-grow">
        Authors
      </h1>
      <div class="tw-flex tw-gap-x-4">
        <Button
          label="Create a new author"
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
      v-model:selection="selectedAuthors"
      :globalFilterFields="['name']"
      dataKey="_id"
      filterDisplay="row"
      :value="authors?.data"
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
              v-if="selectedAuthors && selectedAuthors.length > 0"
              type="button"
              icon="pi pi-trash"
              severity="danger"
              :label="`Delete (${selectedAuthors.length})`"
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
      <template #empty> No author found.</template>
      <Column selectionMode="multiple"></Column>
      <Column header="Photo">
        <template #body="slotProps">
          <NuxtImg
            :src="slotProps.data.photoUrl || 'image-break.png'"
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
              @click="confirmDeleteAuthor(slotProps.data._id)"
            />
          </div>
        </template>
      </Column>
      <template #loading> Loading author data. Please wait. </template>
      <template #footer>
        In total there are {{ authors ? authors.data.length : 0 }} authors.
      </template>
    </DataTable>
  </div>
</template>
