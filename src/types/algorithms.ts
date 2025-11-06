// Canonical algorithm identifiers. Extend as new algorithms are added.
export const Algorithm = {
    BubbleSort: "bubble-sort",
    SelectionSort: "selection-sort",
    BSTSearch: "bst-search",
    BSTInsert: "bst-insert",
    BSTDelete: "bst-delete",
    GraphBFS: "graph-bfs",
} as const;
  
export type AlgorithmType = (typeof Algorithm)[keyof typeof Algorithm];

/** UI/domain catalog for algorithms: default, list and validation. */
export class AlgorithmCatalog {
    static readonly default: AlgorithmType = Algorithm.BubbleSort;
    static readonly all: readonly AlgorithmType[] = Object.values(Algorithm);
    private static readonly algorithmNames: Record<AlgorithmType, { name: string }> = {
        [Algorithm.BubbleSort]: { name: "Bubble Sort" },
        [Algorithm.SelectionSort] : { name: "Selection Sort"},
        [Algorithm.BSTSearch]: { name: "BST Search" },
        [Algorithm.BSTInsert]: { name: "BST Insert" },
        [Algorithm.BSTDelete]: { name: "BST Delete" },
        [Algorithm.GraphBFS]: { name: "Graph BFS" },
    }

    static label(id: AlgorithmType): string {
        return AlgorithmCatalog.algorithmNames[id].name;
    }

    static isValid(value: string): value is AlgorithmType {
        return (this.all as string[]).includes(value);
    }
}