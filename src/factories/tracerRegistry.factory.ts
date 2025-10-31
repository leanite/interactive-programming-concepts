import { BubbleSortArrayTracer } from "@tracers"
import { TracerRegistry } from "@registries";
import { tracerKey } from "@keys";
import { Algorithm } from "@algorithms";
import { Language } from "@languages";
import { bubbleSortTypeScriptRanges } from "@snippets";

export function buildTracerRegistry(): TracerRegistry {
    const tracerRegistry = new TracerRegistry();

    tracerRegistry.register(tracerKey(Algorithm.BubbleSort, Language.TypeScript), 
        new BubbleSortArrayTracer(Language.TypeScript, bubbleSortTypeScriptRanges));
    
    return tracerRegistry;
}
