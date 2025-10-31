// Canonical algorithm identifiers. Extend as new algorithms are added.
export const Algorithm = {
    BubbleSort: "bubble-sort",
    // BstSearch: "bst-search",
    // BstInsert: "bst-insert",
} as const;
  
export type AlgorithmType = (typeof Algorithm)[keyof typeof Algorithm];