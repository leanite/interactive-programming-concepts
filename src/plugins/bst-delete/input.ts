import type { TreeNode } from "@types";
import type { BSTDeleteInput } from "./tracer";

/**
 * Generate random input for BST Delete:
 * - An existing BST with 5-8 nodes
 * - A value to delete that MUST exist in the tree
 */
export function generateBSTDeleteInput(): BSTDeleteInput {
  // Create a BST with 5-8 nodes
  const nodeCount = 5 + Math.floor(Math.random() * 4); // 5-8 nodes
  const values = generateUniqueValues(nodeCount, 10, 90);

  // Build BST from values
  let root: TreeNode | null = null;
  for (const val of values) {
    root = insertIntoTree(root, val);
  }

  // Pick a random value that EXISTS in the tree to delete
  const valueToDelete = values[Math.floor(Math.random() * values.length)];

  return { root, value: valueToDelete };
}

/**
 * Generate N unique random values in range [min, max].
 */
function generateUniqueValues(count: number, min: number, max: number): number[] {
  const values = new Set<number>();
  while (values.size < count) {
    values.add(min + Math.floor(Math.random() * (max - min + 1)));
  }
  return Array.from(values);
}

/**
 * Helper to insert a value into BST (for generating input tree).
 * Creates a NEW tree with the value inserted (does not mutate).
 */
function insertIntoTree(node: TreeNode | null, value: number): TreeNode {
  if (node === null) {
    return { id: `n${value}`, value, left: null, right: null };
  }

  // Create a new node with the same values to avoid mutation
  // Normalize left/right to ensure they're never undefined
  if (value < node.value) {
    return {
      id: node.id,
      value: node.value,
      left: insertIntoTree(node.left ?? null, value),
      right: node.right ?? null,
    };
  } else if (value > node.value) {
    return {
      id: node.id,
      value: node.value,
      left: node.left ?? null,
      right: insertIntoTree(node.right ?? null, value),
    };
  }

  // Value already exists, normalize and return
  return {
    id: node.id,
    value: node.value,
    left: node.left ?? null,
    right: node.right ?? null,
  };
}
