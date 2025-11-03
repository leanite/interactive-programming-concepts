import type { BubbleSortCodeRange } from "@tracers";

/**
 * Code line ranges for Bubble Sort in TypeScript snippet.
 * Keep these in sync with: src/snippets/typescript/bubble-sort.txt
 */
export const bubbleSortTypeScriptRanges: BubbleSortCodeRange = {
  signature: { lineStart: 1 },
  outerLoop: { lineStart: 2 },
  innerLoop: { lineStart: 3 },
  compare: { lineStart: 4 },
  swapBlock: { lineStart: 5, lineEnd: 7 },
  returnStmt: { lineStart: 12 },
};

export const bubbleSortPythonRanges: BubbleSortCodeRange = {
  signature: { lineStart: 1 },
  outerLoop: { lineStart: 4 },
  innerLoop: { lineStart: 5 },
  compare:   { lineStart: 6 },
  swapBlock: { lineStart: 7, lineEnd: 9 },
  returnStmt:{ lineStart: 10 },
} as const;