import { BubbleSortArrayTracer } from "@tracers"
import { TracerRegistry } from "@registries";

export function buildTracerRegistry(): TracerRegistry {
    const tracerRegistry = new TracerRegistry();

    tracerRegistry.register("bubble-sort:typescript", new BubbleSortArrayTracer());
    
    return tracerRegistry;
}
