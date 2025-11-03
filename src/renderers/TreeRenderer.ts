import type { IVisualRenderer } from "@renderers";
import type { VisualOperation } from "@operations";
import type { TreeVisualizationState } from "@types";
import type { TreeOperation } from "@operations";
import { Operation } from "@operations";

/**
 * TreeRenderer interprets tree-focused operations
 * ("tree/visit", "tree/compare", "tree/move-left", "tree/move-right")
 * and reduces them into a TreeVisualizationState.
 */
export class TreeRenderer implements IVisualRenderer<TreeVisualizationState> {
  compute(initial: TreeVisualizationState, operations: VisualOperation[]): TreeVisualizationState {
    // Shallow-clone visual state. We keep `root` structural reference immutable,
    // and copy the focus/path fields to avoid mutating external state.
    const state: TreeVisualizationState = {
      root: initial.root ?? null,
      focusId: initial.focusId,
      compareKey: initial.compareKey,
      pathIds: initial.pathIds ? [...initial.pathIds] : [],
    };

    for (const op of operations as TreeOperation[]) {
      switch (op.operation) {
        case Operation.BSTVisit: {
          // Focus current node and append to the path (avoid duplicates in a row)
          state.focusId = op.nodeId;
          if (!state.pathIds) state.pathIds = [];
          const last = state.pathIds[state.pathIds.length - 1];
          if (last !== op.nodeId) state.pathIds.push(op.nodeId);
          break;
        }

        case Operation.BSTCompare: {
          // Store the searched key for HUD rendering
          state.compareKey = op.key;
          break;
        }

        case Operation.BSTMoveLeft:
        case Operation.BSTMoveRight: {
          // Movement ops are informational; next visit will update focus/path.
          // We keep them as no-ops in the visual state reducer.
          break;
        }
      }
    }

    return state;
  }

  /**
   * Optional validation for tree operations.
   * Ensures required fields are present and types are correct.
   */
  validate?(operations: VisualOperation[]): void {
    for (const op of operations as TreeOperation[]) {
      switch (op.operation) {
        case Operation.BSTVisit: {
          if (typeof op.nodeId !== "string" || op.nodeId.length === 0) {
            throw new Error(`Invalid TreeVisit: missing/invalid nodeId: ${JSON.stringify(op)}`);
          }
          break;
        }
        case Operation.BSTCompare: {
          const okId = typeof op.nodeId === "string" && op.nodeId.length > 0;
          const okKey = Number.isFinite(op.key);
          if (!okId || !okKey) {
            throw new Error(`Invalid TreeCompare: nodeId/key: ${JSON.stringify(op)}`);
          }
          break;
        }
        case Operation.BSTMoveLeft:
        case Operation.BSTMoveRight: {
          const okFrom = typeof op.fromId === "string" && op.fromId.length > 0;
          const okTo = typeof op.toId === "string" && op.toId.length > 0;
          if (!okFrom || !okTo) {
            throw new Error(`Invalid TreeMove*: fromId/toId: ${JSON.stringify(op)}`);
          }
          break;
        }
      }
    }
  }
}