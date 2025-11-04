import type { IAlgorithmTracer } from "@tracers";
import { type TracerKey, tracerKey } from "@keys";
import { Algorithm, type LanguageType, type StepSequence, type TreeNode } from "@types";
import { Operation } from "@operations";
import { VisualStepBuilder } from "@builders";
import { Structure } from "@structures";
import type { SnippetRange } from "@snippet";

/** Code range map required by this tracer (algorithm-specific shape). */
export type BSTInsertCodeRange = SnippetRange & {
  signature: { lineStart: number; lineEnd?: number };
  baseCase: { lineStart: number; lineEnd?: number };
  compareLeft: { lineStart: number; lineEnd?: number };
  recurseLeft: { lineStart: number; lineEnd?: number };
  recurseRight: { lineStart: number; lineEnd?: number };
  returnNode: { lineStart: number; lineEnd?: number };
};

export type BSTInsertInput = {
  root: TreeNode | null;
  value: number;
};

/**
 * Tracer for BST Insert algorithm.
 * Visualizes the recursive insertion of a value into a Binary Search Tree.
 */
export class BSTInsertTracer implements IAlgorithmTracer<BSTInsertInput> {
  readonly id: TracerKey;
  readonly algorithm = Algorithm.BSTInsert;
  readonly structure = Structure.BST;

  constructor(language: LanguageType) {
    this.id = tracerKey(this.algorithm, language);
  }

  /**
   * Trace BST Insert algorithm step by step.
   * IMPORTANT: This function does NOT mutate the input tree.
   * It only generates visual operations that will be applied by the renderer.
   */
  buildTrace(input: BSTInsertInput, ranges: BSTInsertCodeRange): StepSequence {
    const builder = new VisualStepBuilder();
    const { root, value } = input;

    builder.add(ranges.signature, `Inserting value ${value} into BST`);

    // Generate trace without mutating the input tree
    this.insertRecursive(root, value, ranges, builder);

    builder.add(ranges.returnNode, "Insertion complete");

    return builder.build();
  }

  /**
   * Recursive helper to trace insertion.
   * IMPORTANT: This does NOT mutate the tree, only generates visual operations.
   * Returns the ID of the newly created node, or null if no insertion happened.
   */
  private insertRecursive(
    node: TreeNode | null,
    value: number,
    ranges: BSTInsertCodeRange,
    builder: VisualStepBuilder
  ): string | null {
    // Base case: empty spot found, create new node
    if (node === null || node === undefined) {
      const newNodeId = `n${value}`;
      builder.add(
        ranges.baseCase,
        `Empty spot found - creating new node with value ${value}`,
        [
          {
            operation: Operation.BSTCreateNode,
            nodeId: newNodeId,
            value: value,
          },
        ]
      );
      return newNodeId;
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

    // Compare and decide direction
    if (value < node.value) {
      builder.add(
        ranges.compareLeft,
        `${value} < ${node.value}, go left`,
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

      // Recursively trace left subtree (returns new node ID if created)
      const newNodeId = this.insertRecursive(node.left, value, ranges, builder);

      // Only attach if a new node was actually created
      if (newNodeId !== null) {
        builder.add(
          ranges.recurseLeft,
          `Attaching new node ${value} as left child of ${node.value}`,
          [
            {
              operation: Operation.BSTAttachNode,
              parentId: node.id,
              newNodeId: newNodeId,
              side: "left",
            },
          ]
        );
      }

      return null; // No new node at this level
    } else if (value > node.value) {
      builder.add(
        ranges.recurseRight,
        `${value} > ${node.value}, go right`,
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

      // Recursively trace right subtree (returns new node ID if created)
      const newNodeId = this.insertRecursive(node.right, value, ranges, builder);

      // Only attach if a new node was actually created
      if (newNodeId !== null) {
        builder.add(
          ranges.recurseRight,
          `Attaching new node ${value} as right child of ${node.value}`,
          [
            {
              operation: Operation.BSTAttachNode,
              parentId: node.id,
              newNodeId: newNodeId,
              side: "right",
            },
          ]
        );
      }

      return null; // No new node at this level
    } else {
      // Value already exists - do nothing (BST property: no duplicates)
      builder.add(
        ranges.baseCase,
        `Value ${value} already exists in tree, skipping`,
        []
      );
      return null; // No insertion
    }
  }
}
