// Canonical structures identifiers. Extend as new structures are added.
export const Structure = {
    Array: "array",
    // BST: "bst",
} as const;
  
export type StructureId = (typeof Structure)[keyof typeof Structure];