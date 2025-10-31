import type { IVisualRenderer } from "@renderers";
import type { VisualOperation } from "@operations";
import type { ArrayVisualState } from "@types";
import { OperationKind } from "@operations";

/**
 * ArrayRenderer interprets array-focused operations
 * ("array/compare", "array/swap") and reduces them into an ArrayVisualState.
 */
export class ArrayRenderer implements IVisualRenderer<ArrayVisualState> {
  compute(initial: ArrayVisualState, operations: VisualOperation[]): ArrayVisualState {
    const state: ArrayVisualState = {
      values: [...initial.values],
      focus: initial.focus ? { ...initial.focus } : undefined,
    };

    for (const operation of operations) {
      switch (operation.kind) {
        case OperationKind.ArrayCompare:
          state.focus = { i1: operation.i, i2: operation.j };
          break;
        case OperationKind.ArraySwap:
          const i = operation.i;
          const j = operation.j;
          const temp = state.values[i];
          state.values[i] = state.values[j];
          state.values[j] = temp;
          state.focus = { i1: i, i2: j };
          break;
        default:
          // Ignore operations from other domains (tree, graph, etc.)
          break;
      }
    }

    return state;
  }

  validate?(operations: VisualOperation[]): void {
    for (const operation of operations) {
      if (
        operation.kind === OperationKind.ArrayCompare ||
        operation.kind === OperationKind.ArraySwap
      ) {
        if (!Number.isInteger(operation.i) || !Number.isInteger(operation.j)) {
          throw new Error(`Invalid array operation indices: ${JSON.stringify(operation)}`);
        }
      }
    }
  }
}