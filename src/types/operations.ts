/**
 * Operation defines every possible kind of visual operation.
 * It serves as the single source of truth across renderers and tracers.
 */
export const Operation = {
    // Array operations
    ArrayCompare: "array/compare",
    ArraySwap: "array/swap",

    // BST traversal operations
    BSTVisit: "bst/visit",
    BSTCompare: "bst/compare",
    BSTMoveLeft: "bst/move-left",
    BSTMoveRight: "bst/move-right",

    // BST mutation operations
    BSTCreateNode: "bst/create-node",
    BSTAttachNode: "bst/attach-node",
  } as const;
  
// Derived type for all operation kind string literals
export type OperationType = (typeof Operation)[keyof typeof Operation];

/**
 * Visual operations describe domain actions interpreted by renderers.
 */
export type ArrayOperation =
  | { operation: typeof Operation.ArrayCompare; i: number; j: number }
  | { operation: typeof Operation.ArraySwap; i: number; j: number };

export type TreeOperation =
  | { operation: typeof Operation.BSTVisit; nodeId: string }
  | { operation: typeof Operation.BSTCompare; nodeId: string; key: number }
  | { operation: typeof Operation.BSTMoveLeft; fromId: string; toId: string }
  | { operation: typeof Operation.BSTMoveRight; fromId: string; toId: string }
  | { operation: typeof Operation.BSTCreateNode; nodeId: string; value: number }
  | { operation: typeof Operation.BSTAttachNode; parentId: string; newNodeId: string; side: "left" | "right" };

// Future: extend VisualOperation with tree and graph operations.
export type VisualOperation = ArrayOperation | TreeOperation;