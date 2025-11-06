/**
 * Data structure definitions.
 * Contains node structures for various data structures (trees, graphs, etc).
 */

export interface TreeNode {
  id: string; // unique id (e.g., "n42")
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

/**
 * Graph node structure.
 * Represents a vertex in a graph with its adjacent neighbors.
 */
export interface GraphNode {
  id: string; // unique id (e.g., "n0", "n1", etc.)
  label: string; // display label (e.g., "A", "B", etc.)
}

/**
 * Graph structure using adjacency list representation.
 */
export interface Graph {
  nodes: GraphNode[]; // list of all nodes
  edges: Map<string, string[]>; // adjacency list: node id -> list of neighbor ids
}
