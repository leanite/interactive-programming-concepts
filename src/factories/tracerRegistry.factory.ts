import { BubbleSortArrayTracer } from "@tracers"
import { tracerKey, TracerRegistry } from "@registries";
import { Algorithm } from "@algorithms";
import { Language } from "@languages";

export function buildTracerRegistry(): TracerRegistry {
    const tracerRegistry = new TracerRegistry();

    tracerRegistry.register(tracerKey(Algorithm.BubbleSort, Language.TypeScript), new BubbleSortArrayTracer());
    
    return tracerRegistry;
}
