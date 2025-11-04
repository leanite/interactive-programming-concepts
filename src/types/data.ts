/**
 * Data structure definitions.
 * Contains node structures for various data structures (trees, graphs, etc).
 */

export interface TreeNode {
  id: string; // unique id (e.g., "n42")
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}
