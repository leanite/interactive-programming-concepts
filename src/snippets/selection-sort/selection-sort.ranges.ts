import type { SelectionSortCodeRange } from "@tracers";

export const selectionSortTypeScriptRanges: SelectionSortCodeRange  = {
    signature: { lineStart: 1 },
    outerLoop: { lineStart: 3 },
    innerLoop: { lineStart: 5 },
    compare: { lineStart: 6 },
    swapBlock: { lineStart: 11, lineEnd: 13 },
    returnStmt: { lineStart: 16 },
} as const;