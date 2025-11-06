import type { PluginManifest } from "@types";
import { Algorithm, Language } from "@types";
import { Structure } from "@structures";
import { BFSTracer } from "./tracer";
import { generateBFSInput } from "./input";

// Import snippets
import typescriptCode from "./snippets/typescript.txt?raw";
import { typescriptRanges } from "./snippets/ranges";

/**
 * Plugin Manifest for Graph BFS (Breadth-First Search).
 *
 * This file explicitly declares all plugin capabilities:
 * - Algorithm: graph-bfs
 * - Structure: graph
 * - Languages: TypeScript
 * - Tracer: BFSTracer
 * - Code snippets for each language
 * - Random input generator (connected graph + start node)
 */
const graphBfsPlugin: PluginManifest = {
  algorithm: Algorithm.GraphBFS,
  structure: Structure.Graph,
  languages: [Language.TypeScript] as const,

  createTracer: (language) => new BFSTracer(language),

  snippets: {
    [Language.TypeScript]: {
      code: typescriptCode,
      ranges: typescriptRanges,
    },
  },

  inputGenerator: generateBFSInput,
};

export default graphBfsPlugin;
