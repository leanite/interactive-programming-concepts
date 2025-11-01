// Centralized engine Bootstrap: creates registries, registers built-in renderers,
// and exposes a shared Runner. This file does NOT wire UI; it only prepares the engine.

import { Runner } from "@engines";
import { buildTracerRegistry, buildRendererRegistry, buildSnippetRegistry } from "@factories";

// Expose a shared Runner instance for future wiring
buildSnippetRegistry();
export const runner = new Runner(buildTracerRegistry(), buildRendererRegistry());