import type { BubbleSortCodeRange } from "../tracer";

/**
 * Code line ranges for Bubble Sort in TypeScript snippet.
 * Keep these in sync with: src/plugins/bubble-sort/snippets/typescript.txt
 */
export const typescriptRanges: BubbleSortCodeRange = {
  signature: { lineStart: 1 },
  outerLoop: { lineStart: 2 },
  innerLoop: { lineStart: 3 },
  compare: { lineStart: 4 },
  swapBlock: { lineStart: 5, lineEnd: 7 },
  returnStmt: { lineStart: 12 },
};

/**
 * Code line ranges for Bubble Sort in Python snippet.
 * Keep these in sync with: src/plugins/bubble-sort/snippets/python.txt
 */
export const pythonRanges: BubbleSortCodeRange = {
  signature: { lineStart: 1 },
  outerLoop: { lineStart: 4 },
  innerLoop: { lineStart: 5 },
  compare:   { lineStart: 6 },
  swapBlock: { lineStart: 7, lineEnd: 9 },
  returnStmt:{ lineStart: 10 },
} as const;
