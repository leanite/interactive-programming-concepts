import type { PluginManifest } from "@types";
import { Algorithm, Language } from "@types";
import { Structure } from "@structures";
import { BSTInsertTracer } from "./tracer";
import { generateBSTInsertInput } from "./input";

// Import snippets
import typescriptCode from "./snippets/typescript.txt?raw";
import { typescriptRanges } from "./snippets/ranges";

/**
 * Plugin Manifest for BST Insert.
 *
 * This file explicitly declares all plugin capabilities:
 * - Algorithm: bst-insert
 * - Structure: bst (binary search tree)
 * - Languages: TypeScript
 * - Tracer: BSTInsertTracer
 * - Code snippets for each language
 * - Random input generator (BST tree + value to insert)
 */
const bstInsertPlugin: PluginManifest = {
  algorithm: Algorithm.BSTInsert,
  structure: Structure.BST,
  languages: [Language.TypeScript] as const,

  createTracer: (language) => new BSTInsertTracer(language),

  snippets: {
    [Language.TypeScript]: {
      code: typescriptCode,
      ranges: typescriptRanges,
    },
  },

  inputGenerator: generateBSTInsertInput,
};

export default bstInsertPlugin;
