import type { PluginManifest } from "@types";
import { Algorithm, Language } from "@types";
import { Structure } from "@structures";
import { BSTSearchTracer } from "./tracer";
import { generateBSTInput } from "./input";

// Import snippets
import typescriptCode from "./snippets/typescript.txt?raw";
import { typescriptRanges } from "./snippets/ranges";

/**
 * Plugin Manifest for BST Search.
 *
 * This file explicitly declares all plugin capabilities:
 * - Algorithm: bst-search
 * - Structure: bst (binary search tree)
 * - Languages: TypeScript
 * - Tracer: BSTSearchTracer
 * - Code snippets for each language
 * - Random input generator (BST tree + key)
 */
const bstSearchPlugin: PluginManifest = {
  algorithm: Algorithm.BSTSearch,
  structure: Structure.BST,
  languages: [Language.TypeScript] as const,

  createTracer: (language) => new BSTSearchTracer(language),

  snippets: {
    [Language.TypeScript]: {
      code: typescriptCode,
      ranges: typescriptRanges,
    },
  },

  inputGenerator: generateBSTInput,
};

export default bstSearchPlugin;
