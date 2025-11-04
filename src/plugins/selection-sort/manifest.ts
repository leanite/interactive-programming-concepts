import type { PluginManifest } from "@types";
import { Algorithm, Language } from "@types";
import { Structure } from "@structures";
import { SelectionSortArrayTracer } from "./tracer";
import { createArraySortInput } from "../bubble-sort/input"; // Reuses the same input generator

// Import snippets
import typescriptCode from "./snippets/typescript.txt?raw";
import { typescriptRanges } from "./snippets/ranges";

/**
 * Plugin Manifest for Selection Sort.
 *
 * This file explicitly declares all plugin capabilities:
 * - Algorithm: selection-sort
 * - Structure: array
 * - Languages: TypeScript
 * - Tracer: SelectionSortArrayTracer
 * - Code snippets for each language
 * - Random input generator (reuses bubble-sort's)
 */
const selectionSortPlugin: PluginManifest = {
  algorithm: Algorithm.SelectionSort,
  structure: Structure.Array,
  languages: [Language.TypeScript] as const,

  createTracer: (language) => new SelectionSortArrayTracer(language),

  snippets: {
    [Language.TypeScript]: {
      code: typescriptCode,
      ranges: typescriptRanges,
    },
  },

  inputGenerator: createArraySortInput,
};

export default selectionSortPlugin;
