<script setup lang="ts">
import { useForm } from "vee-validate";
import validationUtils from "@/utils/validationUtils";
import { toTypedSchema } from "@vee-validate/yup";
import type {
  IHttpSuccessResponse,
  IHttpPostDataResponse,
  ICuentaPresupuestaria,
} from "~/types";

const props = defineProps<{
  cuentapresupuestaria: ICuentaPresupuestaria;
  onCreated: () => {};
}>();
const emit = defineEmits(["close", "created"]);
const close = () => emit("close");
const nivelCuenta = computed(() => {
  return props.cuentapresupuestaria.nivelCuentaPresupuestaria.toLowerCase();
});

const config = useRuntimeConfig();
const { data: parent, pending: loadingParent } = useApiFetch<
  IHttpSuccessResponse<ICuentaPresupuestaria>
>(
  `cuentapresupuestaria/${props.cuentapresupuestaria.idCtaPresupuestariaPadre}`,
  {
    server: false,
  }
);

const { handleSubmit, values: valuesForm } = useForm<ICuentaPresupuestaria>({
  initialValues: {
    ...props.cuentapresupuestaria,
  },
  validationSchema: toTypedSchema(
    validationUtils.generics.cuentaPresupuestariaSchema()
  ),
});

const createCod = (values: ICuentaPresupuestaria) => {
  return [
    values.codigoTipo,
    values.codigoConcepto,
    values.codigoCuenta,
    values.codigoSubCuenta,
    values.codigoAuxiliar,
  ]
    .filter((e) => e != 0)
    .join(".");
};

const onSubmit = handleSubmit(async (values: ICuentaPresupuestaria) => {
  values.codCuentaPresupuestaria = createCod(values);
  await $fetch<IHttpSuccessResponse<IHttpPostDataResponse>>(
    `cuentapresupuestaria/${values.id}`,
    {
      baseURL: config.public.apiUrl,
      method: "PUT",
      body: values,
      onResponse: () => {
        emit("created");
        close();
      },
      onResponseError: (r: any) => {
        console.error("error", r.response);
        alert(JSON.stringify(r.response._data, null, 2));
      },
    }
  );
});

const estadoBoolean = computed(() => {
  return valuesForm.estado == "HABILITADO" ? true : false;
});
</script>

<template>
  <div class="tw-py-2">
    <ProgressSpinner class="tw-mx-auto tw-w-full" v-if="loadingParent" />
    <FormsCuentaPresupuestariaTableResume
      v-if="parent?.data"
      :cuenta="parent.data"
    />
    <TabView
      :scrollable="true"
      :pt="{
        panelContainer: { class: 'tw-px-1' },
        navContent: { class: 'tw-text-sm' },
      }"
    >
      <TabPanel header="General">
        <form @submit.prevent="onSubmit">
          <div class="tw-flex tw-flex-col tw-gap-y-6 tw-my-2">
            <CustomInputTextField
              name="codCuentaPresupuestaria"
              label="Codigo"
              placeholder="Codigo de cuenta"
              disabled
            />
            <CustomInputTextField
              name="desNombreCuentaPresupuestaria"
              :label="`Descripción ${nivelCuenta}`"
              placeholder="Escriba una descripción de la cuenta"
            />
            <CustomInputSwitchField
              name="estado"
              checkedLabel="Habilitado"
              uncheckedLabel="Inhabilitado"
              checkedValue="HABILITADO"
              uncheckedValue="INHABILITADO"
            />
            <div class="tw-flex tw-flex-col tw-gap-2">
              <h6 class="tw-font-light tw-text-lg">Opciones de la cuenta</h6>
              <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                <CustomCheckboxField
                  name="agruparIngresos"
                  label="Agrupar Ingresos"
                />
                <CustomCheckboxField name="limitativo" label="Limitativo" />
                <CustomCheckboxField name="imputable" label="Imputable" />
                <CustomCheckboxField
                  name="ctaSeguroSocial"
                  label="Seguro Social"
                />
                <CustomCheckboxField
                  name="permiteTransferencia"
                  label="Permite Transferencia"
                />
              </div>
              <Divider />

              <div class="tw-grid tw-grid-cols-2 tw-gap-x-4">
                <CustomCalendarField
                  name="codPeriodoDesde"
                  label="Periodo desde"
                  placeholder="Escriba el periodo desde"
                />
                <CustomCalendarField
                  name="codPeriodoHasta"
                  label="Periodo hasta"
                  placeholder="Escriba el periodo hasta"
                />
              </div>
              <CustomTextareaField
                v-if="!estadoBoolean"
                name="comentarioDeshabilitacion"
                label="Comentario inhabilitación"
                placeholder="Comentario de inhabilitación"
                :disabled="estadoBoolean"
              />
            </div>
          </div>

          <Divider />

          <div class="tw-flex tw-justify-end tw-gap-x-2">
            <Button label="Cancelar" text size="small" @click="close" />
            <Button label="Modificar" size="small" type="submit" />
          </div>
        </form>
      </TabPanel>
      <TabPanel header="Fuente de Financiamiento">
        <DataTableCuentaVinculadas
          :id="cuentapresupuestaria.id"
          tipoCuentaVinculo="FUENTE_FINANCIAMIENTO"
          origen="CUENTA_PRESUPUESTARIA"
        />
      </TabPanel>
      <TabPanel header="Items de compras">
        <DataTableCuentaVinculadas
          :id="cuentapresupuestaria.id"
          tipoCuentaVinculo="ITEMS_COMPRA"
          origen="CUENTA_PRESUPUESTARIA"
        />
      </TabPanel>
      <TabPanel header="Cuenta Contable">
        <DataTableCuentaVinculadas
          :id="cuentapresupuestaria.id"
          tipoCuentaVinculo="CUENTA_CONTABLES"
          origen="CUENTA_PRESUPUESTARIA"
        />
      </TabPanel>
      <TabPanel header="Clasificador Económico">
        <DataTableCuentaVinculadas
          :id="cuentapresupuestaria.id"
          tipoCuentaVinculo="CLASIFICADOR_ECONOMICO"
          origen="CUENTA_PRESUPUESTARIA"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
