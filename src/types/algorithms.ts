// Canonical algorithm identifiers. Extend as new algorithms are added.
export const Algorithm = {
    BubbleSort: "bubble-sort",
    SelectionSort: "selection-sort"
    // BstSearch: "bst-search",
    // BstInsert: "bst-insert",
} as const;
  
export type AlgorithmType = (typeof Algorithm)[keyof typeof Algorithm];

/** Human-friendly names per algorithm id. */


/** UI/domain catalog for algorithms: default, list and validation. */
export class AlgorithmCatalog {
    static readonly default: AlgorithmType = Algorithm.BubbleSort;
    static readonly all: readonly AlgorithmType[] = Object.values(Algorithm);
    private static readonly algorithmNames: Record<AlgorithmType, { name: string }> = {
        [Algorithm.BubbleSort]: { name: "Bubble Sort" },
        [Algorithm.SelectionSort] : { name: "Selection Sort"},
        // [Algorithm.BstSearch]: { name: "BST Search" },
        // [Algorithm.BstInsert]: { name: "BST Insert" },
    }

    static label(id: AlgorithmType): string {
        return AlgorithmCatalog.algorithmNames[id].name;
    }

    static isValid(value: string): value is AlgorithmType {
        return (this.all as string[]).includes(value);
    }
}