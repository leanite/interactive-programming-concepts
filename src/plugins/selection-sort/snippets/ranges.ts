import type { SelectionSortCodeRange } from "../tracer";

/**
 * Code line ranges for Selection Sort in TypeScript snippet.
 * Keep these in sync with: src/plugins/selection-sort/snippets/typescript.txt
 */
export const typescriptRanges: SelectionSortCodeRange  = {
    signature: { lineStart: 1 },
    outerLoop: { lineStart: 3 },
    innerLoop: { lineStart: 5 },
    compare: { lineStart: 6 },
    swapBlock: { lineStart: 11, lineEnd: 13 },
    returnStmt: { lineStart: 16 },
} as const;
