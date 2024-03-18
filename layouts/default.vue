<script setup lang="ts">
import type { MenuPassThroughOptions } from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";
import type { BreadcrumbPassThroughOptions } from "primevue/breadcrumb";
import type { PassThrough } from "primevue/ts-helpers";

const { signOut, data } = useAuth();

const route = useRoute();

const menuPTStyle: PassThrough<MenuPassThroughOptions> = {
  root: { class: " tw-border tw-border-0 tw-rounded-none tw-bg-white" },
};

const breadcrumbPTStyle: PassThrough<BreadcrumbPassThroughOptions> = {
  root: { class: "tw-bg-transparent" },
};

const sideBarItems: MenuItem[] = [
  {
    separator: true,
  },
  {
    label: "Management",
    items: [
      {
        label: "Books",
        icon: "pi pi-sitemap",
        href: "/books",
      },
      {
        label: "Authors",
        icon: "pi pi-chart-pie",
        href: "/authors",
      },
      {
        label: "Tags",
        icon: "pi pi-wallet",
      },
      {
        label: "Files",
        icon: "pi pi-clone",
        href: "/files",
      },
    ],
  },
  {
    label: "Profile",
    items: [
      {
        label: "Settings",
        icon: "pi pi-cog",
        shortcut: "⌘+O",
      },
      {
        label: "Messages",
        icon: "pi pi-inbox",
        badge: 2,
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        shortcut: "⌘+Q",
        command: async () => await signOut(),
      },
    ],
  },
];

const routeForBreadCrumb = computed(() =>
  route.path
    .split("/")
    .filter((val) => val != "")
    .map((val) => {
      const url = route.path.slice(0, route.path.lastIndexOf(val) + val.length);
      const label = val.charAt(0).toUpperCase() + val.slice(1);
      return { label, route: url };
    })
);

const home = ref({
  icon: "pi pi-home",
  url: "/",
});
</script>

<template>
  <div
    class="tw-flex tw-flex-col tw-h-full tw-bg-gradient-to-r tw-from-slate-100 tw-via-white tw-via-60% tw-to-slate-50 tw-to-90%"
  >
    <div
      class="tw-fixed tw-border-r tw-border-gray-300 tw-w-72 tw-overflow-x-hidden tw-h-full tw-top-0 tw-left-0 tw-bg-white tw-px-2"
    >
      <Menu :model="sideBarItems" :pt="menuPTStyle">
        <template #start>
          <NuxtLink href="/">
            <span class="tw-flex tw-items-center tw-gap-x-2 tw-px-2 tw-py-8">
              <NuxtImg
                width="60"
                height="60"
                loading="eager"
                decoding="auto"
                ismap
                src="logo.svg"
              />
              <span class="tw-font-medium tw-text-xl"
                >Litterarum Dashboard</span
              >
            </span>
          </NuxtLink>
        </template>
        <template #item="{ item }">
          <NuxtLink :href="item.href">
            <div class="tw-flex tw-items-center tw-gap-x-2 tw-p-2">
              <span :class="item.icon" />
              <span class="">{{ item.label }}</span>
              <span
                v-if="item.shortcut"
                class="tw-ml-auto tw-border tw-rounded tw-text-xs tw-p-1"
                >{{ item.shortcut }}</span
              >
            </div>
          </NuxtLink>
        </template>
      </Menu>
    </div>

    <div class="tw-ml-72">
      <div class="tw-flex tw-justify-between tw-items-center tw-mx-12 tw-my-6">
        <Breadcrumb
          :home="home"
          :model="routeForBreadCrumb"
          :pt="breadcrumbPTStyle"
        />
        <Avatar
          :image="data?.user?.image ? data.user.image : undefined"
          class="tw-text-white tw-bg-blue-900"
          size="large"
          shape="circle"
        />
      </div>
    </div>
    <div class="tw-ml-72 tw-h-full">
      <div
        class="tw-bg-white tw-border tw-border-gray-300 tw-rounded-lg tw-mx-12 tw-mb-6 tw-shadow-sm tw-min-h-screen"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
