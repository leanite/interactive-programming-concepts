import type { IVisualRenderer } from "@renderers";
import type { VisualOperation } from "@operations";
import type { GraphVisualizationState } from "@types";
import type { GraphOperation } from "@operations";
import { Operation } from "@operations";

/**
 * GraphRenderer interprets graph-focused operations and reduces them
 * into a GraphVisualizationState. Handles traversal operations like visit,
 * enqueue, dequeue, and edge exploration.
 */
export class GraphRenderer implements IVisualRenderer<GraphVisualizationState> {
  compute(initial: GraphVisualizationState, operations: VisualOperation[]): GraphVisualizationState {
    const state: GraphVisualizationState = {
      graph: initial.graph,
      visitedIds: initial.visitedIds ? [...initial.visitedIds] : [],
      queueIds: initial.queueIds ? [...initial.queueIds] : [],
      focusId: initial.focusId,
      exploredEdges: initial.exploredEdges ? [...initial.exploredEdges] : [],
    };

    for (const op of operations as GraphOperation[]) {
      switch (op.operation) {
        case Operation.GraphVisit: {
          // Focus on the current node being processed
          state.focusId = op.nodeId;
          break;
        }

        case Operation.GraphEnqueue: {
          // Add node to the queue
          if (!state.queueIds) state.queueIds = [];
          if (!state.queueIds.includes(op.nodeId)) {
            state.queueIds.push(op.nodeId);
          }
          break;
        }

        case Operation.GraphDequeue: {
          // Remove node from the queue
          if (state.queueIds) {
            const index = state.queueIds.indexOf(op.nodeId);
            if (index !== -1) {
              state.queueIds.splice(index, 1);
            }
          }
          break;
        }

        case Operation.GraphExploreEdge: {
          // Mark an edge as explored
          if (!state.exploredEdges) state.exploredEdges = [];
          state.exploredEdges.push({ from: op.fromId, to: op.toId });
          break;
        }

        case Operation.GraphMarkVisited: {
          // Mark a node as visited
          if (!state.visitedIds) state.visitedIds = [];
          if (!state.visitedIds.includes(op.nodeId)) {
            state.visitedIds.push(op.nodeId);
          }
          break;
        }
      }
    }

    return state;
  }

  /**
   * Optional validation for graph operations.
   * Ensures required fields are present and types are correct.
   */
  validate?(operations: VisualOperation[]): void {
    for (const op of operations as GraphOperation[]) {
      switch (op.operation) {
        case Operation.GraphVisit:
        case Operation.GraphEnqueue:
        case Operation.GraphDequeue:
        case Operation.GraphMarkVisited: {
          if (typeof op.nodeId !== "string" || op.nodeId.length === 0) {
            throw new Error(`Invalid ${op.operation}: missing/invalid nodeId: ${JSON.stringify(op)}`);
          }
          break;
        }
        case Operation.GraphExploreEdge: {
          const okFrom = typeof op.fromId === "string" && op.fromId.length > 0;
          const okTo = typeof op.toId === "string" && op.toId.length > 0;
          if (!okFrom || !okTo) {
            throw new Error(`Invalid GraphExploreEdge: fromId/toId: ${JSON.stringify(op)}`);
          }
          break;
        }
      }
    }
  }
}
