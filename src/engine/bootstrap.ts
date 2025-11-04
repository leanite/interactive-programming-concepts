// Centralized engine Bootstrap: creates registries, registers built-in renderers,
// and exposes a shared Runner. This file does NOT wire UI; it only prepares the engine.

import { Runner, loadPlugins } from "@engines";
import { RendererRegistry } from "@registries";

// Load plugin-based registries (tracers, snippets, inputs)
const { tracerRegistry, snippetRegistry, inputRegistry } = loadPlugins();

// Expose a shared Runner instance for future wiring
export const runner = new Runner(
  tracerRegistry,
  RendererRegistry.buildDefault(),
  snippetRegistry,
  inputRegistry
);