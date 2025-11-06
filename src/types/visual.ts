import type { TreeNode, Graph } from "./data";

export type Focus = {
    i1: number;      // index of the primary focused bar
    i2?: number;     // optional secondary (e.g., adjacent compare)
};

export type VisualizationState = {
    values: number[]; // heights or magnitudes to draw
    focus?: Focus;    // which indices are currently emphasized
};

// Visual state for 1D array renderers.
// The canvas reads this to draw bars and highlight focused indices.
export type ArrayVisualizationState = {
    /** Current array values to render as bars (heights). */
    values: number[];
    /** Optional focused indices (e.g., compare or swap pairs). */
    focus?: { i1: number; i2?: number };
};

// Visual state for tree renderers.
// The canvas reads this to draw trees and highlight focused nodes.
export interface TreeVisualizationState {
    root: TreeNode | null;
    focusId?: string ;        // current node being visited
    compareKey?: number;     // key we're searching
    pathIds?: string[];      // path from root to current
    deleteNodeId?: string;   // node marked for deletion (rendered in red)
}

// Visual state for graph renderers.
// The canvas reads this to draw graphs and highlight focused nodes/edges.
export interface GraphVisualizationState {
    graph: Graph;
    visitedIds?: string[];    // nodes that have been visited (explored)
    queueIds?: string[];      // nodes currently in the queue (frontier)
    focusId?: string;         // current node being processed
    exploredEdges?: Array<{from: string; to: string}>; // edges that have been explored
}