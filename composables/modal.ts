import type {
  DynamicDialogOptions,
  DynamicDialogInstance,
} from "primevue/dynamicdialogoptions";

const formsComponents = {
  createOrEditBook: defineAsyncComponent(
    () => import("~/components/forms/Book/CreateOrEdit.vue")
  ),
  createOrEditAuthor: defineAsyncComponent(
    () => import("~/components/forms/Author/CreateOrEdit.vue")
  ),
};

type ModalOptions = {
  title?: string;
  description?: string;
};

const DialogHeader = (options: ModalOptions) => {
  return [
    h("div", {}, [
      h(
        "h2",
        {
          class: "tw-text-xl tw-font-medium tw-capitalize",
        },
        options.title
      ),
      h(
        "p",
        {
          class: "tw-text-xs tw-text-gray-500",
        },
        options.description
      ),
    ]),
  ];
};

const closeModalHandler = (
  dialogRef: DynamicDialogInstance,
  onClose?: () => void
) => {
  dialogRef.close();
  if (onClose) return onClose();
};

export const useModal = () => {
  const dialog = useDialog();
  const open = (
    content: any,
    options?: ModalOptions,
    dynamicDialogOptions?: DynamicDialogOptions
  ) => {
    return dialog.open(content, {
      props: {
        modal: true,
        draggable: false,
        style: {
          width: "35vw",
        },
      },
      templates: {
        ...(options && { header: DialogHeader(options) }),
      },
      ...dynamicDialogOptions,
    });
  };

  const genericsOpenForms = <T extends Record<string, any>>(
    forms: Component, // should be a component
    formProps: T,
    options?: ModalOptions,
    dynamicDialogOptions?: DynamicDialogOptions
  ) => {
    const dialogRef = open(
      h(
        forms,
        {
          ...formProps,
          onClose: () => closeModalHandler(dialogRef, formProps.onClose),
        },
        {}
      ),
      {
        title: "Especifique un nombre modal para este modal",
        description: "especifique una descripción del modal",
        ...options,
      },
      dynamicDialogOptions
    );
    return dialogRef;
  };

  const openForm = <T extends Record<string, any>>(
    form: "CreateOrEditBook" | "CreateOrEditAuthor",
    formProps: T,
    options?: ModalOptions,
    dynamicDialogOptions?: DynamicDialogOptions
  ) => {
    const defaultModalOptions = {
      title: "Modal Title",
      description: "description of the modal",
      ...options,
    };
    const forms = {
      CreateOrEditBook: () =>
        genericsOpenForms(
          formsComponents.createOrEditBook,
          formProps,
          defaultModalOptions,
          dynamicDialogOptions
        ),
      CreateOrEditAuthor: () =>
        genericsOpenForms(
          formsComponents.createOrEditAuthor,
          formProps,
          defaultModalOptions,
          dynamicDialogOptions
        ),
      default: () => {
        // this will never be executed. Unless that types check fails
        console.log(`${form} unknown modals form.`);
      },
    };

    return forms[form] ? forms[form]() : forms["default"];
  };

  return {
    open,
    genericsOpenForms,
    openForm,
  };
};
