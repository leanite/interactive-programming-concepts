import type { ArrayOperation } from "@types";

export type ArrayState = {
  values: number[];
  focus?: { i1: number; i2?: number };
};

// Compute the current array state by replaying all operations up to this step.
// NOTE: pure function, no mutations on the base array.
export function computeArrayState(base: number[], operations: ArrayOperation[]): ArrayState {
  const values = [...base];
  let focus: ArrayState["focus"] = undefined;

  for (const op of operations) {
    if (op.type === "compare") {
      focus = { i1: op.i, i2: op.j };
    } else if (op.type === "swap") {
      if (inBounds(values, op.i) && inBounds(values, op.j)) {
        const tmp = values[op.i];
        values[op.i] = values[op.j];
        values[op.j] = tmp;
      }
      focus = { i1: op.i, i2: op.j };
    }
  }

  return { values, focus };
}

function inBounds(arr: unknown[], idx: number) {
  return Number.isInteger(idx) && idx >= 0 && idx < arr.length;
}