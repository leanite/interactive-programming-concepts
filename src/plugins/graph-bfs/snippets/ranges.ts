import type { BFSCodeRange } from "../tracer";

export const typescriptRanges: BFSCodeRange = {
  signature: { lineStart: 1, lineEnd: 1 },
  initialization: { lineStart: 2, lineEnd: 7 },
  whileLoop: { lineStart: 9, lineEnd: 9 },
  dequeue: { lineStart: 10, lineEnd: 10 },
  visitNode: { lineStart: 11, lineEnd: 11 },
  exploreNeighbors: { lineStart: 13, lineEnd: 13 },
  checkVisited: { lineStart: 14, lineEnd: 14 },
  markVisited: { lineStart: 15, lineEnd: 15 },
  enqueue: { lineStart: 16, lineEnd: 16 },
  returnResult: { lineStart: 20, lineEnd: 20 },
};
