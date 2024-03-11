import type { ButtonProps, ButtonContext } from 'primevue/button'

const MyPreset = {
  button: {
    root: (props: ButtonProps, ctx: ButtonContext) => ({
      // class: `${props.size == "small" ? 'tw-w-10 tw-h-10' : 'tw-w-14 tw-h-14'}`,
    })
  },
  tree: {
    root: { class: 'tw-border-0 tw-p-0' },
    input: {
      placeholder: 'Escribe el termino por el cual deseas buscar',
      class: 'placeholder:tw-text-gray-400 tw-p-3 tw-text-sm tw-rounded-lg',
    },
    content: { class: 'tw-w-full tw-p-1.5 tw-rounded-lg' },
    label: { class: 'tw-w-full' },
    filterContainer: { class: 'tw-mb-4' },
    toggler: { class: 'hover:tw-bg-gray-200' },
    togglerIcon: { class: 'tw-text-blue-900 tw-w-2.5 tw-h-2.5' },
    // subgroup: { class: 'tw-pl-4' },
    loadingOverlay: {
      class: 'tw-bg-transparent',
    },

  },
  tabView: {
    panelContainer: { class: 'tw-px-1' },
    navContent: { class: 'tw-text-sm' },
  }
}

export default MyPreset;
