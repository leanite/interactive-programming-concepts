import type { PluginManifest } from "@types";
import { Algorithm, Language } from "@types";
import { Structure } from "@structures";
import { BubbleSortArrayTracer } from "./tracer";
import { createArraySortInput } from "./input";

// Import snippets
import typescriptCode from "./snippets/typescript.txt?raw";
import pythonCode from "./snippets/python.txt?raw";
import { typescriptRanges, pythonRanges } from "./snippets/ranges";

/**
 * Plugin Manifest for Bubble Sort.
 *
 * This file explicitly declares all plugin capabilities:
 * - Algorithm: bubble-sort
 * - Structure: array
 * - Languages: TypeScript and Python
 * - Tracer: BubbleSortArrayTracer
 * - Code snippets for each language
 * - Random input generator
 */
const bubbleSortPlugin: PluginManifest = {
  algorithm: Algorithm.BubbleSort,
  structure: Structure.Array,
  languages: [Language.TypeScript, Language.Python] as const,

  createTracer: (language) => new BubbleSortArrayTracer(language),

  snippets: {
    [Language.TypeScript]: {
      code: typescriptCode,
      ranges: typescriptRanges,
    },
    [Language.Python]: {
      code: pythonCode,
      ranges: pythonRanges,
    },
  },

  inputGenerator: createArraySortInput,
};

export default bubbleSortPlugin;
