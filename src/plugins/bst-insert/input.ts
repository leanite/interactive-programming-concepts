import type { TreeNode } from "@types";
import type { BSTInsertInput } from "./tracer";

/**
 * Generate random input for BST Insert:
 * - An existing BST with 4-7 nodes
 * - A new value to insert (ensuring it creates an interesting path)
 */
export function generateBSTInsertInput(): BSTInsertInput {
  // Create a small BST with 4-7 nodes
  const nodeCount = 4 + Math.floor(Math.random() * 4); // 4-7 nodes
  const values = generateUniqueValues(nodeCount, 10, 90);

  // Build BST from values
  let root: TreeNode | null = null;
  for (const val of values) {
    root = insertIntoTree(root, val);
  }

  // Generate a new value to insert
  // 50% chance: value that extends the tree (not in existing values)
  // 50% chance: value that goes deep into the tree
  const existingValues = new Set(values);
  let valueToInsert: number;

  if (Math.random() < 0.5) {
    // Generate a new value not in the tree
    do {
      valueToInsert = 10 + Math.floor(Math.random() * 80);
    } while (existingValues.has(valueToInsert));
  } else {
    // Pick a value that creates an interesting path
    valueToInsert = values[Math.floor(Math.random() * values.length)] +
                    (Math.random() < 0.5 ? -5 : 5);
    // Ensure it's unique
    while (existingValues.has(valueToInsert) || valueToInsert < 10 || valueToInsert > 90) {
      valueToInsert = 10 + Math.floor(Math.random() * 80);
    }
  }

  return { root, value: valueToInsert };
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
  if (value < node.value) {
    return {
      id: node.id,
      value: node.value,
      left: insertIntoTree(node.left, value),
      right: node.right,
    };
  } else if (value > node.value) {
    return {
      id: node.id,
      value: node.value,
      left: node.left,
      right: insertIntoTree(node.right, value),
    };
  }

  // Value already exists, return the same node
  return node;
}
