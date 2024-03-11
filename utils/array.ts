import type { TreeNode } from "primevue/treenode";

export const arrayToTree = (arr: TreeNode[], parent = "0"): TreeNode[] =>
  arr
    .filter((node) => node.parent === parent)
    .map((child) => ({ ...child, children: arrayToTree(arr, child.key) }));
