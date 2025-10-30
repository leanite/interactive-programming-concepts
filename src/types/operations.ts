// Visual operations describe domain actions that the renderer will interpret.
// Start with array-focused operations; we will extend this union with tree/graph later.

export type ArrayOperation =
  | { kind: "array/compare"; i: number; j: number } // highlight two indices (no mutation)
  | { kind: "array/swap"; i: number; j: number };   // swap values at indices

// In the future we will add:
// export type TreeOperation = { kind: "tree/create-node"; id: string; value: number } | ...;
// export type GraphOperation = { kind: "graph/add-edge"; u: string; v: string } | ...;

// For now, the overall visual operation type equals the array operations.
// This keeps the engine minimal while providing a clear extension point.
export type VisualOperation = ArrayOperation;