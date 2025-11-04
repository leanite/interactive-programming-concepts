import type { IVisualRenderer } from "@renderers";
import type { VisualOperation } from "@operations";
import type { TreeVisualizationState } from "@types";
import type { TreeOperation } from "@operations";
import type { TreeNode } from "@types";
import { Operation } from "@operations";

/**
 * TreeRenderer interprets tree-focused operations and reduces them
 * into a TreeVisualizationState. Handles both traversal operations
 * (visit, compare, move) and mutation operations (create node, attach node).
 */
export class TreeRenderer implements IVisualRenderer<TreeVisualizationState> {
  compute(initial: TreeVisualizationState, operations: VisualOperation[]): TreeVisualizationState {
    // For mutation operations, we need to deep clone the tree structure
    // to avoid modifying the original. For traversal-only operations,
    // we can keep the structural reference.
    const hasMutation = (operations as TreeOperation[]).some(
      (op) => op.operation === Operation.BSTCreateNode || op.operation === Operation.BSTAttachNode
    );

    const state: TreeVisualizationState = {
      root: hasMutation ? deepCloneTree(initial.root) : initial.root,
      focusId: initial.focusId,
      compareKey: initial.compareKey,
      pathIds: initial.pathIds ? [...initial.pathIds] : [],
    };

    // Temporary map to store created nodes until they're attached
    const pendingNodes = new Map<string, TreeNode>();

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

        case Operation.BSTCreateNode: {
          // Create a new standalone node and store it temporarily.
          // It will be attached to the tree via BSTAttachNode operation.
          const newNode: TreeNode = {
            id: op.nodeId,
            value: op.value,
            left: null,
            right: null,
          };
          pendingNodes.set(op.nodeId, newNode);
          state.focusId = op.nodeId;
          break;
        }

        case Operation.BSTAttachNode: {
          // Attach a pending node to a parent node (left or right child)
          const newNode = pendingNodes.get(op.newNodeId);
          if (!newNode) {
            console.warn(`BSTAttachNode: node ${op.newNodeId} not found in pending nodes`);
            break;
          }

          if (state.root === null) {
            // Special case: attaching to empty tree (becomes root)
            state.root = newNode;
          } else {
            const parent = findNodeById(state.root, op.parentId);
            if (parent) {
              if (op.side === "left") {
                parent.left = newNode;
              } else {
                parent.right = newNode;
              }

              // Focus the newly attached node and add to path
              state.focusId = op.newNodeId;
              if (!state.pathIds) state.pathIds = [];
              state.pathIds.push(op.newNodeId);
            } else {
              console.warn(`BSTAttachNode: parent ${op.parentId} not found in tree`);
            }
          }

          // Remove from pending nodes once attached
          pendingNodes.delete(op.newNodeId);
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
        case Operation.BSTCreateNode: {
          const okId = typeof op.nodeId === "string" && op.nodeId.length > 0;
          const okValue = Number.isFinite(op.value);
          if (!okId || !okValue) {
            throw new Error(`Invalid BSTCreateNode: nodeId/value: ${JSON.stringify(op)}`);
          }
          break;
        }
        case Operation.BSTAttachNode: {
          const okParent = typeof op.parentId === "string" && op.parentId.length > 0;
          const okNew = typeof op.newNodeId === "string" && op.newNodeId.length > 0;
          const okSide = op.side === "left" || op.side === "right";
          if (!okParent || !okNew || !okSide) {
            throw new Error(`Invalid BSTAttachNode: parentId/newNodeId/side: ${JSON.stringify(op)}`);
          }
          break;
        }
      }
    }
  }
}

/**
 * Helper: Deep clone a tree structure to allow safe mutation.
 */
function deepCloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) return null;

  return {
    id: node.id,
    value: node.value,
    left: deepCloneTree(node.left),
    right: deepCloneTree(node.right),
  };
}

/**
 * Helper: Find a node by ID in a tree (DFS traversal).
 */
function findNodeById(root: TreeNode | null, id: string): TreeNode | null {
  if (root === null) return null;
  if (root.id === id) return root;

  const leftResult = findNodeById(root.left, id);
  if (leftResult) return leftResult;

  return findNodeById(root.right, id);
}
