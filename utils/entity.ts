import type { TreeNode } from "primevue/treenode";
import type {
  ICuentaPresupuestaria,
  ICuentaEconomica,
  CuentaPresupuestariaNivel,
  CuentaEconomicaNivel,
} from "~/types";
import { arrayToTree } from "./array";
import type { FuncionalNivel, IFuncional } from "~/types/clasificadores/funcional/funcional";
import type { GeograficoNivel, IGeografico } from "~/types/clasificadores/geografico/geografico";

const Sort = {
  sortNumerically: (a: TreeNode, b: TreeNode, field: string) => {
    return a.input[field].localeCompare(b.input[field], undefined, {
      numeric: true,
    });
  },
};

export const CuentaPresupuestaria = {
  createTreeNode: (arr: ICuentaPresupuestaria[]) => {
    const base: TreeNode[] = [];

    for (const it of arr) {
      base.push({
        key: it.id.toString(),
        label: `${it.codCuentaPresupuestaria} - ${it.desNombreCuentaPresupuestaria}`,
        parent: it.idCtaPresupuestariaPadre.toString(),
        level: it.nivelCuentaPresupuestaria,
        input: it,
      });
    }
    return arrayToTree(base, "0").sort((a, b) =>
      Sort.sortNumerically(a, b, "codCuentaPresupuestaria")
    );
  },
  getLevelFromOrigin: (origin: CuentaPresupuestariaNivel | "CLASIFICADOR") => {
    // Obtén el nivel de la cuenta se va a crear a partir del nivel de la cuenta del padre.
    const names = {
      CLASIFICADOR: "TIPO",
      TIPO: "CONCEPTO",
      CONCEPTO: "CUENTA",
      CUENTA: "SUBCUENTA",
      SUBCUENTA: "AUXILIAR",
      AUXILIAR: undefined,
    };
    return names[origin];
  },
};

export const CuentaEconomica = {
  createTreeNode: (arr: ICuentaEconomica[]) => {
    const base: TreeNode[] = [];

    // clean orphan element who has has not parent...
    arr = arr.filter((el) => el.idCtaEconomicaPadre !== null);

    for (const it of arr) {
      base.push({
        key: it.id.toString(),
        label: `${it.codCuentaEconomica} - ${it.desCuentaEconomica}`,
        parent: it.idCtaEconomicaPadre.toString(),
        level: it.nivelCuentaEconomica,
        input: it,
      });
    }
    const tree = arrayToTree(base, "0");
    return tree.sort((a, b) =>
      Sort.sortNumerically(a, b, "codCuentaEconomica")
    );
  },
  getLevelFromOrigin: (origin: CuentaEconomicaNivel | "CLASIFICADOR") => {
    // Obtén el nivel de la cuenta se va a crear a partir del nivel de la cuenta del padre.
    const names = {
      CLASIFICADOR: "TITULO",
      TITULO: "SUBTITULO",
      SUBTITULO: "GRUPO",
      GRUPO: "SUBGRUPO",
      SUBGRUPO: "CUENTA",
      CUENTA: "SUBCUENTA",
      SUBCUENTA: "AUXILIAR",
      AUXILIAR: undefined,
    };
    return names[origin];
  },
};


export const Funcional = {
  createTreeNode: (arr: IFuncional[]) => {
    const base: TreeNode[] = [];
    for (const it of arr) {
      base.push({
        key: it.id.toString(),
        label: `${it.nombre} - ${it.descripcion}`,
        parent:
          it.idFuncionalPadre?.toString() == undefined
            ? "0"
            : it.idFuncionalPadre?.toString(),
        level: it.nivel.toUpperCase(),
        input: it,
      });
    }
    return arrayToTree(base, "0").sort((a,b)=>Sort.sortNumerically(a, b, "codigo"));
  },
  getLevelFromOrigin: (origin: FuncionalNivel | "CLASIFICADOR") => {
    let names = {
     CLASIFICADOR:"FINALIDAD",
     FINALIDAD: "FUNCION",
     FUNCION: "SUBFUNCION",
     SUBFUNCION: undefined,
   };
   return names[origin];
 }
 
};


export const Geografico = {
  createTreeNode: (arr: IGeografico[]) => {
    const base: TreeNode[] = [];
    for (const it of arr) {
      base.push({
        key: it.id.toString(),
        label: `${it.nombre} - ${it.descripcion}`,
        parent:
          it.idGeograficoPadre?.toString() == undefined
            ? "0"
            : it.idGeograficoPadre?.toString(),
        level: it.nivel.toUpperCase(),
        input: it,
      });
    }
    return arrayToTree(base, "0").sort((a,b)=>Sort.sortNumerically(a, b, "codigo"));
  },
 
  getLevelFromOrigin:(origin: GeograficoNivel | "PAIS")=>{
    const names = {
      PAIS:"REGION",
      REGION:"PROVINCIA",
      PROVINCIA:"MUNICIPIO",
      MUNICIPIO:"DISTRITO_MUNICIPAL",
      DISTRITO_MUNICIPAL:"SECCION",
      SECCION:"PARAJE",
      PARAJE:undefined
    };
  
    return names[origin];
  }
};

