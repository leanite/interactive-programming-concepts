export type ArrayOperation =
  | { type: "compare"; i: number; j: number } // highlight two indexes (no mutation)
  | { type: "swap"; i: number; j: number };   // mutate values by swapping