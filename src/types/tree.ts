export interface TreeNode {
    id: string;          // unique id (e.g., "n42")
    value: number;
    left?: TreeNode;
    right?: TreeNode;
}
  
export interface TreeVisualizationState {
    root: TreeNode | null;
    focusId?: string;        // current node being visited
    compareKey?: number;     // key we're searching
    pathIds?: string[];      // path from root to current
}