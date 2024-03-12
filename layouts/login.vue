<template>
  <div
    class="tw-flex tw-flex-col tw-h-full tw-min-h-screen tw-bg-gradient-to-r tw-from-slate-100 tw-via-white tw-via-60% tw-to-slate-50 tw-to-90%"
  >
    <div class="tw-mx-auto tw-grid tw-space-y-8">
      <div class="tw-mx-auto tw-border-gray-300">
        <NuxtImg
          width="100"
          height="100"
          loading="eager"
          decoding="auto"
          ismap
          src="logo.svg"
        />
      </div>
      <div
        class="tw-bg-white tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm"
      >
        <slot />
      </div>
    </div>
    <footer class="tw-mt-auto tw-text-center">
      <small>
        Copyright © 2024 Litterarum.org. All Rights Reserved. | Made with
        &hearts; by
        <NuxtLink href="https://github.com/mandragora-hub"
          >Mandragora-hub</NuxtLink
        >
      </small>
    </footer>
  </div>
</template>
