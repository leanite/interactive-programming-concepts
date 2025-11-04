import type { TreeNode } from "@types";

export interface BSTSearchInput {
  root: TreeNode | null;
  key: number;
}

// Simple BST builder from values; returns root.
function createBST(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  let nextId = 1;

  const makeNode = (v: number): TreeNode => ({ id: `n${nextId++}`, value: v });

  function insert(node: TreeNode | null, v: number): TreeNode {
    if (!node) return makeNode(v);
    if (v < node.value) {
      return { ...node, left: insert(node.left ?? null, v) };
    } else if (v > node.value) {
      return { ...node, right: insert(node.right ?? null, v) };
    } else {
      return node; // ignore duplicates
    }
  }

  for (const v of values) root = insert(root, v);
  return root;
}

// Default generator used by the registry (can be replaced by UI later)
export function generateBSTInput(): BSTSearchInput {
  const sample = [50, 30, 70, 20, 40, 60, 80];
  const root = createBST(sample);
  const keyPool = sample.length > 0 ? sample : [0];
  const key = keyPool[Math.floor(Math.random() * keyPool.length)];
  return { root, key };
}
