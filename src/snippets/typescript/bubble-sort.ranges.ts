import type { BubbleSortCodeRanges } from "@tracers";

/**
 * Code line ranges for Bubble Sort in TypeScript snippet.
 * Keep these in sync with: src/snippets/typescript/bubble-sort.txt
 */
export const bubbleSortTypeScriptRanges: BubbleSortCodeRanges = {
  signature: { lineStart: 1 },
  outerLoop: { lineStart: 2 },
  innerLoop: { lineStart: 3 },
  compare: { lineStart: 4 },
  swapBlock: { lineStart: 5, lineEnd: 7 },
  returnStmt: { lineStart: 12 },
};