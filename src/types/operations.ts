/**
 * Operation defines every possible kind of visual operation.
 * It serves as the single source of truth across renderers and tracers.
 */
export const Operation = {
    // Array operations
    ArrayCompare: "array/compare",
    ArraySwap: "array/swap",
  
    // (future)
    // TreeInsert: "tree/insert",
    // GraphAddEdge: "graph/add-edge",
  } as const;
  
// Derived type for all operation kind string literals
export type OperationType = (typeof Operation)[keyof typeof Operation];

/**
 * Visual operations describe domain actions interpreted by renderers.
 */
export type ArrayOperation =
  | { operation: typeof Operation.ArrayCompare; i: number; j: number }
  | { operation: typeof Operation.ArraySwap; i: number; j: number };

// Future: extend VisualOperation with tree and graph operations.
export type VisualOperation = ArrayOperation;