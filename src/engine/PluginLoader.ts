import type { PluginManifest } from "@types";
import { TracerRegistry, SnippetRegistry, InputRegistry } from "@registries";
import { tracerKey, formatUniqueKey } from "@keys";
import { Snippet } from "@snippet";

/**
 * PluginLoader: loads plugin manifests and populates the registries.
 *
 * This loader implements the "registration by manifest" pattern, where each plugin
 * explicitly declares its capabilities in a manifest.ts file.
 *
 * Benefits:
 * - Zero manual boilerplate in factories
 * - Adding algorithm = create folder + manifest
 * - Explicit and easy to debug code
 * - Type-safe with TypeScript
 *
 * To add a new algorithm:
 * 1. Create folder src/plugins/[algorithm-name]/
 * 2. Create manifest.ts exporting PluginManifest
 * 3. Add manifest import in this file
 * 4. Add to PLUGIN_MANIFESTS array below
 * 5. Done! 🎉
 */

// ===========================================================================
// REGISTRATION POINT: Add new plugins here
// ===========================================================================

import bubbleSortPlugin from "@plugins/bubble-sort/manifest";
import selectionSortPlugin from "@plugins/selection-sort/manifest";
import bstSearchPlugin from "@plugins/bst-search/manifest";
import bstInsertPlugin from "@plugins/bst-insert/manifest";
import bstDeletePlugin from "@plugins/bst-delete/manifest";
import graphBfsPlugin from "@plugins/graph-bfs/manifest";

/**
 * List of all available plugins.
 * To add a new algorithm, just import the manifest above
 * and add it to this array.
 */
const PLUGIN_MANIFESTS: PluginManifest[] = [
  bubbleSortPlugin,
  selectionSortPlugin,
  bstSearchPlugin,
  bstInsertPlugin,
  bstDeletePlugin,
  graphBfsPlugin,
];

// ===========================================================================
// End of registration point
// ===========================================================================

// Cache of loaded registries (singleton pattern)
let cachedRegistries: {
  tracerRegistry: TracerRegistry;
  snippetRegistry: SnippetRegistry;
  inputRegistry: InputRegistry;
} | null = null;

/**
 * Loads all plugins and populates the registries.
 *
 * IMPORTANT: This function uses cache (singleton pattern).
 * Registries are loaded only once on the first call,
 * and subsequent calls return the same registries.
 *
 * @returns Object containing the three populated registries
 */
export function loadPlugins(): {
  tracerRegistry: TracerRegistry;
  snippetRegistry: SnippetRegistry;
  inputRegistry: InputRegistry;
} {
  // Return cache if already loaded
  if (cachedRegistries) {
    return cachedRegistries;
  }

  // Create new registries
  const tracerRegistry = new TracerRegistry();
  const snippetRegistry = new SnippetRegistry();
  const inputRegistry = new InputRegistry();

  // Iterate over each plugin manifest
  for (const manifest of PLUGIN_MANIFESTS) {
    // 1. Register tracers for each supported language
    for (const language of manifest.languages) {
      const key = tracerKey(manifest.algorithm, language);
      const tracer = manifest.createTracer(language);
      tracerRegistry.register(key, tracer);
    }

    // 2. Register snippets for each supported language
    for (const language of manifest.languages) {
      const snippetData = manifest.snippets[language];
      if (snippetData) {
        const key = formatUniqueKey(manifest.algorithm, language);
        const snippet = new Snippet(
          manifest.algorithm,
          language,
          snippetData.code,
          snippetData.ranges
        );
        snippetRegistry.register(key, snippet);
      }
    }

    // 3. Register input generator (if provided)
    if (manifest.inputGenerator) {
      inputRegistry.registerInputGenerator(manifest.algorithm, manifest.inputGenerator);
    }
  }

  // Cache for reuse
  cachedRegistries = { tracerRegistry, snippetRegistry, inputRegistry };

  return cachedRegistries;
}

/**
 * Returns the list of all loaded plugins.
 * Useful for debugging and inspection.
 */
export function getLoadedPlugins(): PluginManifest[] {
  return PLUGIN_MANIFESTS;
}

/**
 * Validates if a plugin manifest is well-formed.
 * Throws error if there are problems.
 */
function validatePlugin(manifest: PluginManifest): void {
  if (!manifest.algorithm) {
    throw new Error("Plugin manifest must have 'algorithm' property");
  }
  if (!manifest.structure) {
    throw new Error(`Plugin ${manifest.algorithm} must have 'structure' property`);
  }
  if (!manifest.languages || manifest.languages.length === 0) {
    throw new Error(`Plugin ${manifest.algorithm} must have at least one language`);
  }
  if (!manifest.createTracer) {
    throw new Error(`Plugin ${manifest.algorithm} must have 'createTracer' factory`);
  }
  if (!manifest.snippets) {
    throw new Error(`Plugin ${manifest.algorithm} must have 'snippets' object`);
  }

  // Validate that each language has a corresponding snippet
  for (const language of manifest.languages) {
    if (!manifest.snippets[language]) {
      throw new Error(
        `Plugin ${manifest.algorithm} declares language ${language} but has no snippet for it`
      );
    }
  }
}

/**
 * Validates all loaded plugins.
 * Call this during application startup to detect problems early.
 */
export function validateAllPlugins(): void {
  for (const manifest of PLUGIN_MANIFESTS) {
    validatePlugin(manifest);
  }
}
