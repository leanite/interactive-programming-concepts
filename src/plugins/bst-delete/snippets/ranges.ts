import type { BSTDeleteCodeRange } from "../tracer";

export const typescriptRanges: BSTDeleteCodeRange = {
  signature: { lineStart: 1, lineEnd: 1 },
  baseCase: { lineStart: 2, lineEnd: 4 },
  compareLeft: { lineStart: 6, lineEnd: 7 },
  recurseLeft: { lineStart: 7 },
  compareRight: { lineStart: 8, lineEnd: 9 },
  recurseRight: { lineStart: 9 },
  oneChild: { lineStart: 16, lineEnd: 21 },
  twoChildren: { lineStart: 22, lineEnd: 29 },
  findMin: { lineStart: 24, lineEnd: 26 },
  returnNode: { lineStart: 31, lineEnd: 31 },
};
