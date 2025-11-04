import type { BSTInsertCodeRange } from "../tracer";

export const typescriptRanges: BSTInsertCodeRange = {
  signature: { lineStart: 1, lineEnd: 1 },
  baseCase: { lineStart: 2, lineEnd: 4 },
  compareLeft: { lineStart: 6, lineEnd: 6 },
  recurseLeft: { lineStart: 7, lineEnd: 7 },
  recurseRight: { lineStart: 8, lineEnd: 9 },
  returnNode: { lineStart: 11, lineEnd: 11 },
};
