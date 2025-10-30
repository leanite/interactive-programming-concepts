// Centralized engine Bootstrap: creates registries, registers built-in renderers,
// and exposes a shared Runner. This file does NOT wire UI; it only prepares the engine.

import { TracerRegistry, LanguageRegistry, RendererRegistry } from "@engines-registry";
import { Runner } from "@engines";
import { ArrayRenderer } from "@renderers";
import { BubbleSortArrayTracer } from "@tracers"

export const tracerRegistry = new TracerRegistry();
export const languageRegistry = new LanguageRegistry();
export const rendererRegistry = new RendererRegistry();

// Register built-in visual renderers
rendererRegistry.register("array", new ArrayRenderer());

// Register built-in tracers
tracerRegistry.register("bubble-sort:typescript", new BubbleSortArrayTracer());

// Expose a shared Runner instance for future wiring
export const runner = new Runner(tracerRegistry, languageRegistry, rendererRegistry);