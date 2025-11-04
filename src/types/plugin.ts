import type { AlgorithmType } from "@algorithms";
import type { LanguageType } from "@languages";
import type { IAlgorithmTracer } from "@tracers";
import type { SnippetRange } from "@snippet";
import type { StructureType } from "@structures";

/**
 * PluginManifest: explicit declaration of an algorithm plugin.
 *
 * Each plugin declares:
 * - algorithm: algorithm identifier
 * - structure: data structure type (array, bst, etc)
 * - languages: supported programming languages
 * - createTracer: factory function to create the tracer
 * - snippets: code and ranges for each language
 */
export interface PluginManifest {
  /** Unique identifier for the algorithm */
  algorithm: AlgorithmType;

  /** Data structure type (used for renderer selection) */
  structure: StructureType;

  /** Programming languages supported by this plugin */
  languages: readonly LanguageType[];

  /** Factory function to create tracer instance for a language */
  createTracer: (language: LanguageType) => IAlgorithmTracer<any>;

  /** Code snippets for each supported language */
  snippets: {
    [L in LanguageType]?: {
      /** Source code of the snippet */
      code: string;
      /** Line range mapping */
      ranges: SnippetRange;
    };
  };

  /** Function to generate test input for this algorithm */
  inputGenerator?: () => any;
}

/**
 * PluginModule: expected format when importing a plugin file.
 * The plugin must export the manifest as default export.
 */
export interface PluginModule {
  default: PluginManifest;
}
