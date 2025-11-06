import type { IAlgorithmTracer } from "@tracers";
import { type TracerKey, tracerKey } from "@keys";
import { Algorithm, type LanguageType, type StepSequence, type TreeNode } from "@types";
import { Operation } from "@operations";
import { VisualStepBuilder } from "@builders";
import { Structure } from "@structures";
import type { SnippetRange } from "@snippet";

/** Code range map required by this tracer (algorithm-specific shape). */
export type BSTDeleteCodeRange = SnippetRange & {
  signature: { lineStart: number; lineEnd?: number };
  baseCase: { lineStart: number; lineEnd?: number };
  oneChild: { lineStart: number; lineEnd?: number };
  twoChildren: { lineStart: number; lineEnd?: number };
  findMin: { lineStart: number; lineEnd?: number };
  compareLeft: { lineStart: number; lineEnd?: number };
  compareRight: { lineStart: number; lineEnd?: number };
  recurseLeft: { lineStart: number; lineEnd?: number };
  recurseRight: { lineStart: number; lineEnd?: number };
  returnNode: { lineStart: number; lineEnd?: number };
};

export type BSTDeleteInput = {
  root: TreeNode | null;
  value: number;
};

/**
 * Tracer for BST Delete algorithm.
 * Visualizes the recursive deletion of a value from a Binary Search Tree.
 * Handles 3 cases: leaf node, node with 1 child, node with 2 children.
 */
export class BSTDeleteTracer implements IAlgorithmTracer<BSTDeleteInput> {
  readonly id: TracerKey;
  readonly algorithm = Algorithm.BSTDelete;
  readonly structure = Structure.BST;

  constructor(language: LanguageType) {
    this.id = tracerKey(this.algorithm, language);
  }

  /**
   * Trace BST Delete algorithm step by step.
   * IMPORTANT: This function does NOT mutate the input tree.
   * It only generates visual operations that will be applied by the renderer.
   */
  buildTrace(input: BSTDeleteInput, ranges: BSTDeleteCodeRange): StepSequence {
    const builder = new VisualStepBuilder();
    const { root, value } = input;

    builder.add(ranges.signature, `Deleting value ${value} from BST`);

    // Generate trace without mutating the input tree
    this.deleteRecursive(root, value, ranges, builder, null, "left");

    builder.add(ranges.returnNode, "Deletion complete");

    return builder.build();
  }

  /**
   * Recursive helper to trace deletion.
   * IMPORTANT: This does NOT mutate the tree, only generates visual operations.
   * Returns the ID of the node that should replace this position, or null if empty.
   */
  private deleteRecursive(
    node: TreeNode | null,
    value: number,
    ranges: BSTDeleteCodeRange,
    builder: VisualStepBuilder,
    parentId: string | null,
    side: "left" | "right"
  ): string | null {
    // Base case: node not found
    if (node === null || node === undefined) {
      builder.add(ranges.baseCase, `Value ${value} not found in tree`);
      return null;
    }

    // Visit current node
    builder.add(ranges.signature, `Visiting node ${node.value}`, [
      {
        operation: Operation.BSTVisit,
        nodeId: node.id,
      },
      {
        operation: Operation.BSTCompare,
        nodeId: node.id,
        key: value,
      },
    ]);

    // Value is in left subtree
    if (value < node.value) {
      builder.add(
        ranges.compareLeft,
        `${value} < ${node.value}, search left`,
        node.left
          ? [
              {
                operation: Operation.BSTMoveLeft,
                fromId: node.id,
                toId: node.left.id,
              },
            ]
          : []
      );

      builder.add(ranges.recurseLeft, "Recursing to left subtree");

      const replacementId = this.deleteRecursive(node.left ?? null, value, ranges, builder, node.id, "left");

      // If left child was deleted/replaced, emit detach or replace operation
      if (replacementId !== node.left?.id) {
        if (replacementId === null && node.left) {
          // Left child was removed
          builder.add(ranges.recurseLeft, `Detaching left child from node ${node.value}`, [
            {
              operation: Operation.BSTDetachNode,
              parentId: node.id,
              nodeId: node.left.id,
              side: "left",
            },
          ]);
        }
      }

      return node.id;
    }
    // Value is in right subtree
    else if (value > node.value) {
      builder.add(
        ranges.compareRight,
        `${value} > ${node.value}, search right`,
        node.right
          ? [
              {
                operation: Operation.BSTMoveRight,
                fromId: node.id,
                toId: node.right.id,
              },
            ]
          : []
      );

      builder.add(ranges.recurseRight, "Recursing to right subtree");

      const replacementId = this.deleteRecursive(node.right ?? null, value, ranges, builder, node.id, "right");

      // If right child was deleted/replaced, emit detach or replace operation
      if (replacementId !== node.right?.id) {
        if (replacementId === null && node.right) {
          // Right child was removed
          builder.add(ranges.recurseRight, `Detaching right child from node ${node.value}`, [
            {
              operation: Operation.BSTDetachNode,
              parentId: node.id,
              nodeId: node.right.id,
              side: "right",
            },
          ]);
        }
      }

      return node.id;
    }
    // Found the node to delete
    else {
      builder.add(ranges.baseCase, `Found node ${value} to delete`);

      // Case 1: Leaf node (no children)
      if (!node.left && !node.right) {
        // Mark node for deletion
        builder.add(ranges.baseCase, `Node ${value} is a leaf, marking for deletion`, [
          {
            operation: Operation.BSTMarkDelete,
            nodeId: node.id,
          },
        ]);

        // Special case: deleting root node that is a leaf
        if (parentId === null) {
          builder.add(ranges.baseCase, `Root node is a leaf, tree becomes empty`, [
            {
              operation: Operation.BSTDetachNode,
              parentId: "", // Empty string for root
              nodeId: node.id,
              side: "left", // Doesn't matter for root
            },
          ]);
        } else {
          builder.add(ranges.baseCase, `Removing leaf node ${value}`, [
            {
              operation: Operation.BSTDetachNode,
              parentId: parentId,
              nodeId: node.id,
              side,
            },
          ]);
        }
        return null; // Node is removed
      }

      // Case 2: Node with only one child
      if (!node.left || !node.right) {
        const childId = node.left ? node.left.id : node.right!.id;

        builder.add(ranges.oneChild, `Node ${value} has one child, marking for deletion`, [
          {
            operation: Operation.BSTMarkDelete,
            nodeId: node.id,
          },
        ]);

        builder.add(ranges.oneChild, `Replacing node ${value} with its child`, [
          {
            operation: Operation.BSTReplaceNode,
            oldNodeId: node.id,
            newNodeId: childId,
          },
        ]);

        return childId; // Return the child to replace this node
      }

      // Case 3: Node with two children
      // Find the inorder successor (minimum value in right subtree)
      builder.add(ranges.twoChildren, `Node ${value} has two children, marking for deletion`, [
        {
          operation: Operation.BSTMarkDelete,
          nodeId: node.id,
        },
      ]);

      builder.add(ranges.twoChildren, `Finding inorder successor in right subtree`);

      const successorId = this.findMin(node.right, ranges, builder);

      builder.add(ranges.twoChildren, `Replacing node ${value} with successor`, [
        {
          operation: Operation.BSTReplaceNode,
          oldNodeId: node.id,
          newNodeId: successorId,
        },
      ]);

      return successorId; // Return successor to replace this node
    }
  }

  /**
   * Helper to find the minimum value node (leftmost) in a subtree.
   */
  private findMin(node: TreeNode, ranges: BSTDeleteCodeRange, builder: VisualStepBuilder): string {
    builder.add(ranges.findMin, `Finding minimum in subtree starting at ${node.value}`, [
      {
        operation: Operation.BSTVisit,
        nodeId: node.id,
      },
    ]);

    let current = node;
    while (current.left) {
      builder.add(ranges.findMin, `Moving left to node ${current.left.value}`, [
        {
          operation: Operation.BSTMoveLeft,
          fromId: current.id,
          toId: current.left.id,
        },
      ]);

      current = current.left;

      builder.add(ranges.findMin, `Visiting node ${current.value}`, [
        {
          operation: Operation.BSTVisit,
          nodeId: current.id,
        },
      ]);
    }

    builder.add(ranges.findMin, `Found minimum: ${current.value} (will become successor)`);
    return current.id;
  }
}
