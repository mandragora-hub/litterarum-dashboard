<script setup lang="ts">
import type { IHealthcheck, IHttpSuccessResponse } from "~/types";
import ContextMenu from "primevue/contextmenu";
import { formatDistanceToNow } from "date-fns";

const {
  data: healthcheck,
  pending,
  execute,
} = useApiFetch<IHealthcheck>("api/v1/healthcheck", { server: false });

const dateFormat = (millisecond?: number | null) => {
  if (!millisecond) return;
  const date = new Date(millisecond);
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const uptime = (millisecond?: number) => {
  if (!millisecond) return;
  const date = new Date(Date.now() - millisecond * 1000);
  return formatDistanceToNow(date);
};

const data = computed(() => {
  return [
    {
      label: "Uptime",
      value: uptime(healthcheck.value?.uptime) || "",
    },
    {
      label: "Message",
      value: healthcheck.value?.message || "",
    },
    {
      label: "timestamp",
      value: dateFormat(healthcheck.value?.timestamp) || "",
    },
  ];
});

const menu = ref<ContextMenu>();
const items = ref([{ label: "Restart", icon: "pi pi-sync" }]);

const onButtonClick = (event: Event) => {
  menu.value?.show(event);
};
</script>

<template>
  <Card :loading="pending">
    <template #header>
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-x-2">
        <h2 class="tw-font-semibold tw-text-xl">Server Healthcheck</h2>
        <Button
          icon="pi pi-wrench"
          text
          severity="secondary"
          :loading="pending"
          @click="onButtonClick"
        />
      </div>
    </template>
    <template #body v-if="!pending">
      <ul>
        <li v-for="item of data">
          <span class="tw-font-semibold tw-capitalize">{{ item.label }}</span
          >: {{ item.value }}
        </li>
      </ul>
      <ContextMenu ref="menu" :model="items" />
    </template>
  </Card>
</template>
