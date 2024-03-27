<script setup lang="ts">
import type { IHttpSuccessResponse, ITag } from "~/types";
import { FilterMatchMode } from "primevue/api";

const config = useRuntimeConfig();
const modal = useModal();
const confirm = useConfirm();
const toast = useToast();

const {
  data: tags,
  pending,
  execute,
} = useApiFetch<IHttpSuccessResponse<[ITag]>>("api/v1/tags");

const selectedTags = ref<[ITag]>();

const columns = [
  { field: "_id", header: "ID" },
  { field: "tag", sortable: true, header: "Tags" },
];

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const clearFilter = () => {
  filters.value.global.value = null;
};

const confirmDeleteTags = (tagsId: string) => {
  confirm.require({
    header: "Confirmation",
    message: "Do you want to delete this record?",
    icon: "pi pi-info-circle",
    rejectClass: "p-button-secondary p-button-outlined p-button-sm",
    acceptClass: "p-button-danger p-button-sm",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    accept: async () => deleteTag(tagsId),
  });
};

const deleteSelect = () => {};

const deleteTag = async (tagsId: string) => {
  await $fetch(`api/v1/tags/${tagsId}`, {
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

const handleEditButton = (tag: ITag) => {
  modal.openForm(
    "CreateOrEditTag",
    {
      editTag: tag,
      onUpdated: execute,
    },
    {
      title: "Edit Tag",
      description: "Edit tag",
    }
  );
};

const handleCreateButton = () => {
  modal.openForm(
    "CreateOrEditTag",
    {
      onCreated: execute,
    },
    {
      title: `Create a new Tag`,
      description: "Create a new tag for the virtual library",
    }
  );
};

useSeoMeta({
  title: "Tags",
  description: "Management tags for Litterarum.",
});
</script>

<template>
  <Page name="Tags">
    <template #buttons>
      <Button
        label="Create new tag"
        icon="pi pi-plus"
        size="small"
        @click="handleCreateButton"
      />
    </template>
    <template #body>
      <DataTable
        v-model:filters="filters"
        v-model:selection="selectedTags"
        :globalFilterFields="['tag']"
        dataKey="_id"
        filterDisplay="row"
        :value="tags?.data"
        :loading="pending"
        stripedRows
        paginator
        :rows="30"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <template #header>
          <div class="tw-flex tw-justify-between">
            <div class="tw-flex tw-gap-x-2">
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Clear"
                outlined
                @click="clearFilter"
              />
              <Button
                v-if="selectedTags && selectedTags.length > 0"
                type="button"
                icon="pi pi-trash"
                severity="danger"
                :label="`Delete (${selectedTags.length})`"
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
        <template #empty>No tags found.</template>
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
              <Button
                icon="pi pi-file-edit"
                outlined
                size="small"
                @click="handleEditButton(slotProps.data)"
              />
              <!-- <Button icon="pi pi-eye" outlined /> -->
              <Button
                icon="pi pi-trash"
                outlined
                severity="danger"
                size="small"
                @click="confirmDeleteTags(slotProps.data._id)"
              />
            </div>
          </template>
        </Column>
        <template #loading> Loading customers data. Please wait. </template>
        <template #footer>
          In total there are {{ tags ? tags.data.length : 0 }} tags.
        </template>
      </DataTable>
    </template>
  </Page>
</template>
