// Canonical structures identifiers. Extend as new structures are added.
export const Structure = {
    Array: "array",
    BST: "bst",
    Graph: "graph",
} as const;
  
export type StructureType = (typeof Structure)[keyof typeof Structure];