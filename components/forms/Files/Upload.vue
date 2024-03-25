<script setup lang="ts">
import type { FileUploadErrorEvent } from "primevue/fileupload";

const emit = defineEmits(["close", "uploaded"]);
const close = () => emit("close");

const toast = useToast();
const config = useRuntimeConfig();

const uploadUrl = computed(() => `${config.public.apiUrl}/api/v1/files/upload`);

const onAdvancedUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};

const onErrorEvent = (err: FileUploadErrorEvent) => {
  console.error("Error has ocurred on file upload: ", err.xhr.response);
  const data = JSON.parse(err.xhr.response);
  toast.add({
    severity: "error",
    summary: "Error on file upload",
    detail: data.message ? data.message : "Error has ocurred",
    life: 3000,
  });
};
</script>

<template>
  <div class="tw-py-2">
    <div class="tw-flex tw-flex-col tw-gap-y-6 tw-my-2">
      <FileUpload
        name="files"
        :url="uploadUrl"
        @upload="onAdvancedUpload()"
        :multiple="true"
        accept="image/*"
        :maxFileSize="1000000"
        @error="onErrorEvent"
      >
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
      </FileUpload>
      <Divider />
      <div class="tw-flex tw-justify-end tw-gap-x-2">
        <Button label="Close" text size="small" @click="close" />
        <Button label="Done" size="small" @click="close" />
      </div>
    </div>
  </div>
</template>
