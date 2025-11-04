import type { BSTSearchCodeRanges } from "../tracer";

/**
 * Code line ranges for BST Search in TypeScript snippet.
 * Keep these in sync with: src/plugins/bst-search/snippets/typescript.txt
 */
export const typescriptRanges: BSTSearchCodeRanges = {
    signature:  { lineStart: 1 },
    loop:       { lineStart: 3 },            // while (curr)
    compareEq:  { lineStart: 4 },            // key === curr.value
    moveLeft:   { lineStart: 7, lineEnd: 8 },// key < curr.value => left
    moveRight:  { lineStart: 9, lineEnd: 10 },// else => right
    returnTrue: { lineStart: 5 },
    returnFalse:{ lineStart: 13 },
  } as const;
