import type { IAlgorithmTracer } from "@tracers";
import { type TracerKey, tracerKey } from "@keys";
import { Algorithm, type LanguageType, type StepSequence } from "@types";
import type { Graph } from "@types";
import { Operation } from "@operations";
import { VisualStepBuilder } from "@builders";
import { Structure } from "@structures";
import type { SnippetRange } from "@snippet";

/** Code range map required by this tracer (algorithm-specific shape). */
export type BFSCodeRange = SnippetRange & {
  signature: { lineStart: number; lineEnd?: number };
  initialization: { lineStart: number; lineEnd?: number };
  whileLoop: { lineStart: number; lineEnd?: number };
  dequeue: { lineStart: number; lineEnd?: number };
  visitNode: { lineStart: number; lineEnd?: number };
  exploreNeighbors: { lineStart: number; lineEnd?: number };
  checkVisited: { lineStart: number; lineEnd?: number };
  markVisited: { lineStart: number; lineEnd?: number };
  enqueue: { lineStart: number; lineEnd?: number };
  returnResult: { lineStart: number; lineEnd?: number };
};

export type BFSInput = {
  graph: Graph;
  startNodeId: string;
};

/**
 * Tracer for BFS (Breadth-First Search) algorithm.
 * Visualizes the level-by-level exploration of a graph using a queue.
 */
export class BFSTracer implements IAlgorithmTracer<BFSInput> {
  readonly id: TracerKey;
  readonly algorithm = Algorithm.GraphBFS;
  readonly structure = Structure.Graph;

  constructor(language: LanguageType) {
    this.id = tracerKey(this.algorithm, language);
  }

  /**
   * Trace BFS algorithm step by step.
   * Shows queue operations, node visits, and edge exploration.
   */
  buildTrace(input: BFSInput, ranges: BFSCodeRange): StepSequence {
    const builder = new VisualStepBuilder();

    // Validate input
    if (!input || !input.graph || !input.graph.nodes) {
      builder.add(ranges.signature, `Invalid input: graph is missing`);
      return builder.build();
    }

    const { graph, startNodeId } = input;

    // Find start node
    const startNode = graph.nodes.find((n) => n.id === startNodeId);
    if (!startNode) {
      builder.add(ranges.signature, `Start node ${startNodeId} not found`);
      return builder.build();
    }

    builder.add(ranges.signature, `Starting BFS from node ${startNode.label}`);

    // Initialize: visited set and queue
    const visited = new Set<string>();
    const queue: string[] = [];

    builder.add(ranges.initialization, `Initialize: visited = {}, queue = []`);

    // Mark start node as visited and enqueue
    visited.add(startNodeId);
    queue.push(startNodeId);

    builder.add(ranges.initialization, `Mark ${startNode.label} as visited and enqueue`, [
      {
        operation: Operation.GraphMarkVisited,
        nodeId: startNodeId,
      },
      {
        operation: Operation.GraphEnqueue,
        nodeId: startNodeId,
      },
    ]);

    // Main BFS loop
    while (queue.length > 0) {
      builder.add(ranges.whileLoop, `Queue is not empty: [${this.formatQueue(queue, graph)}]`);

      // Dequeue
      const currentId = queue.shift()!;
      const currentNode = graph.nodes.find((n) => n.id === currentId)!;

      builder.add(ranges.dequeue, `Dequeue node ${currentNode.label}`, [
        {
          operation: Operation.GraphDequeue,
          nodeId: currentId,
        },
      ]);

      // Visit node
      builder.add(ranges.visitNode, `Visit node ${currentNode.label}`, [
        {
          operation: Operation.GraphVisit,
          nodeId: currentId,
        },
      ]);

      // Explore neighbors
      const neighbors = graph.edges.get(currentId) || [];

      if (neighbors.length === 0) {
        builder.add(ranges.exploreNeighbors, `Node ${currentNode.label} has no neighbors`);
      } else {
        builder.add(
          ranges.exploreNeighbors,
          `Explore neighbors of ${currentNode.label}: [${this.formatNeighbors(neighbors, graph)}]`
        );

        for (const neighborId of neighbors) {
          const neighborNode = graph.nodes.find((n) => n.id === neighborId)!;

          // Explore edge
          builder.add(ranges.exploreNeighbors, `Exploring edge ${currentNode.label} -> ${neighborNode.label}`, [
            {
              operation: Operation.GraphExploreEdge,
              fromId: currentId,
              toId: neighborId,
            },
          ]);

          // Check if already visited
          if (visited.has(neighborId)) {
            builder.add(ranges.checkVisited, `Node ${neighborNode.label} already visited, skip`);
          } else {
            builder.add(ranges.checkVisited, `Node ${neighborNode.label} not yet visited`);

            // Mark as visited
            visited.add(neighborId);
            builder.add(ranges.markVisited, `Mark ${neighborNode.label} as visited`, [
              {
                operation: Operation.GraphMarkVisited,
                nodeId: neighborId,
              },
            ]);

            // Enqueue
            queue.push(neighborId);
            builder.add(ranges.enqueue, `Enqueue ${neighborNode.label}`, [
              {
                operation: Operation.GraphEnqueue,
                nodeId: neighborId,
              },
            ]);
          }
        }
      }
    }

    builder.add(ranges.whileLoop, `Queue is empty, BFS complete`);
    builder.add(ranges.returnResult, `Visited nodes: [${this.formatVisited(visited, graph)}]`);

    return builder.build();
  }

  /**
   * Format queue for display
   */
  private formatQueue(queue: string[], graph: Graph): string {
    return queue.map((id) => graph.nodes.find((n) => n.id === id)?.label || id).join(", ");
  }

  /**
   * Format neighbors for display
   */
  private formatNeighbors(neighborIds: string[], graph: Graph): string {
    return neighborIds.map((id) => graph.nodes.find((n) => n.id === id)?.label || id).join(", ");
  }

  /**
   * Format visited set for display
   */
  private formatVisited(visited: Set<string>, graph: Graph): string {
    return Array.from(visited)
      .map((id) => graph.nodes.find((n) => n.id === id)?.label || id)
      .join(", ");
  }
}
