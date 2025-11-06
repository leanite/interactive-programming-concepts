/**
 * Plugin Manifest for BST Delete.
 *
 * This file explicitly declares all plugin capabilities:
 * - Algorithm: bst-delete
 * - Structure: bst (binary search tree)
 * - Languages: TypeScript
 * - Tracer: BSTDeleteTracer
 * - Code snippets for each language
 * - Random input generator (BST tree + key)
 */
import type { PluginManifest } from "@types";
import { Algorithm, Language, Structure } from "@types";
import { BSTDeleteTracer } from "./tracer";
import { generateBSTDeleteInput } from "./input";
import { typescriptRanges } from "./snippets/ranges";
import typescriptSnippet from "./snippets/typescript.txt?raw";

const bstDeletePlugin: PluginManifest = {
  algorithm: Algorithm.BSTDelete,
  structure: Structure.BST,
  languages: [Language.TypeScript] as const,

  createTracer: (language) => new BSTDeleteTracer(language),

  snippets: {
    [Language.TypeScript]: {
      code: typescriptSnippet,
      ranges: typescriptRanges,
    },
  },

  inputGenerator: generateBSTDeleteInput,
};

export default bstDeletePlugin;
