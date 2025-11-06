import type { Graph, GraphNode } from "@types";
import type { BFSInput } from "./tracer";

/**
 * Generate a random connected graph for BFS visualization.
 * Creates a graph with 5-7 nodes labeled A, B, C, etc.
 */
export function generateBFSInput(): BFSInput {
  const nodeCount = 5 + Math.floor(Math.random() * 3); // 5-7 nodes

  // Create nodes with letter labels
  const nodes: GraphNode[] = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: `n${i}`,
      label: String.fromCharCode(65 + i), // A, B, C, ...
    });
  }

  // Create adjacency list
  const edges = new Map<string, string[]>();
  for (const node of nodes) {
    edges.set(node.id, []);
  }

  // Generate random edges to create a connected graph
  // Strategy: Start with a spanning tree, then add random edges

  // Step 1: Create spanning tree (ensures connectivity)
  const connected = new Set<string>([nodes[0].id]);
  const unconnected = new Set<string>(nodes.slice(1).map((n) => n.id));

  while (unconnected.size > 0) {
    // Pick a random connected node
    const connectedArray = Array.from(connected);
    const fromNode = connectedArray[Math.floor(Math.random() * connectedArray.length)];

    // Pick a random unconnected node
    const unconnectedArray = Array.from(unconnected);
    const toNode = unconnectedArray[Math.floor(Math.random() * unconnectedArray.length)];

    // Add undirected edge
    addUndirectedEdge(edges, fromNode, toNode);

    // Move to connected set
    connected.add(toNode);
    unconnected.delete(toNode);
  }

  // Step 2: Add 1-3 random edges for complexity
  const extraEdges = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < extraEdges; i++) {
    const from = nodes[Math.floor(Math.random() * nodes.length)].id;
    const to = nodes[Math.floor(Math.random() * nodes.length)].id;

    // Avoid self-loops and duplicate edges
    if (from !== to && !edges.get(from)!.includes(to)) {
      addUndirectedEdge(edges, from, to);
    }
  }

  const graph: Graph = {
    nodes,
    edges,
  };

  // Start BFS from node A (first node)
  const startNodeId = nodes[0].id;

  return { graph, startNodeId };
}

/**
 * Helper to add an undirected edge to the adjacency list.
 */
function addUndirectedEdge(edges: Map<string, string[]>, from: string, to: string): void {
  edges.get(from)!.push(to);
  edges.get(to)!.push(from);
}
