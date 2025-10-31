import { Operation, type ArrayOperation } from "@operations";

export type ArrayState = {
  values: number[];
  focus?: { i1: number; i2?: number };
};

/**
 * Pure reducer that applies array operations to compute the current visual state.
 */
export function computeArrayState(base: number[], operations: ArrayOperation[]): ArrayState {
  const values = [...base];
  let focus: ArrayState["focus"];

  for (const operation of operations) {
    if (operation.operation === Operation.ArrayCompare) {
      focus = { i1: operation.i, i2: operation.j };
    } else if (operation.operation === Operation.ArraySwap) {
      const i = operation.i;
      const j = operation.j;
      const temp = values[i];
      values[i] = values[j];
      values[j] = temp;
      focus = { i1: i, i2: j };
    }
  }

  return { values, focus };
}