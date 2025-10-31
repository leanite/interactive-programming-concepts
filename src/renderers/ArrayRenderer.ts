import type { IVisualRenderer } from "@renderers";
import type { VisualOperation } from "@operations";
import type { ArrayVisualizationState } from "@types";
import { Operation } from "@operations";

/**
 * ArrayRenderer interprets array-focused operations
 * ("array/compare", "array/swap") and reduces them into an ArrayVisualState.
 */
export class ArrayRenderer implements IVisualRenderer<ArrayVisualizationState> {
  compute(initial: ArrayVisualizationState, operations: VisualOperation[]): ArrayVisualizationState {
    const state: ArrayVisualizationState = {
      values: [...initial.values],
      focus: initial.focus ? { ...initial.focus } : undefined,
    };

    for (const operation of operations) {
      switch (operation.operation) {
        case Operation.ArrayCompare:
          state.focus = { i1: operation.i, i2: operation.j };
          break;
        case Operation.ArraySwap:
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
        operation.operation === Operation.ArrayCompare ||
        operation.operation === Operation.ArraySwap
      ) {
        if (!Number.isInteger(operation.i) || !Number.isInteger(operation.j)) {
          throw new Error(`Invalid array operation indices: ${JSON.stringify(operation)}`);
        }
      }
    }
  }
}