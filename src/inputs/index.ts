export * from "./bubbleSort.input"
export * from "./bst.input"

import type { BSTSearchInput } from "@inputs";
import type { BFSInput } from "../plugins/graph-bfs/tracer";

export type AlgorithmInput = number[] | BSTSearchInput | BFSInput;