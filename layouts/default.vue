<script setup lang="ts">
import type { MenuPassThroughOptions } from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";
import type { BreadcrumbPassThroughOptions } from "primevue/breadcrumb";
import type { PassThrough } from "primevue/ts-helpers";

const { signOut } = useAuth();

const route = useRoute();
const router = useRouter();

const setRouteToItem = (r: string) => {
  return {
    command: () => {
      router.push(r);
    },
    route: r,
  };
};

const menuPTStyle: PassThrough<MenuPassThroughOptions> = {
  root: { class: " tw-border tw-border-0 tw-rounded-none tw-bg-white" },
};

const breadcrumbPTStyle: PassThrough<BreadcrumbPassThroughOptions> = {
  root: { class: "tw-bg-transparent tw-border-0" },
  label: ({ context }) => ({
    class:
      context.index == 0
        ? "tw-ml-2 tw-text-neutral-600 hover:tw-text-opacity-80 tw-transition-all tw-duration-150"
        : "tw-text-blue-900 tw-font-medium",
  }),
  separatorIcon: { class: "tw-w-2 tw-h-2 tw-mt-px" },
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
        ...setRouteToItem("/books"),
      },
      {
        label: "Authors",
        icon: "pi pi-chart-pie",
      },
      {
        label: "Tags",
        icon: "pi pi-wallet",
      },
      {
        label: "Files",
        icon: "pi pi-clone",
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
    .map((val, index) => {
      const url = route.path.slice(0, route.path.lastIndexOf(val) + val.length);
      const label = val;
      return index == 0
        ? { label, icon: "pi pi-home", url: url }
        : { label, url: url };
    })
);
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
          <span class="tw-flex tw-items-center tw-gap-x-2 tw-px-2 tw-py-8">
            <NuxtImg
              width="60"
              height="60"
              loading="eager"
              decoding="auto"
              ismap
              src="logo.svg"
            />
            <span class="tw-font-medium tw-text-xl">Litterarum Dashboard</span>
          </span>
        </template>
      </Menu>
    </div>

    <div class="tw-ml-72">
      <div class="tw-flex tw-justify-between tw-items-center tw-mx-12 tw-my-6">
        <Breadcrumb :model="routeForBreadCrumb" :pt="breadcrumbPTStyle" />
        <Avatar
          label="P"
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

<style>
.my-custom-menu-label-shadow:hover {
  text-shadow: 0.2px 0.2px 4px lightskyblue;
}
</style>
