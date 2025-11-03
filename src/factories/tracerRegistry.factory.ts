import { BubbleSortArrayTracer, SelectionSortArrayTracer } from "@tracers"
import { TracerRegistry } from "@registries";
import { tracerKey } from "@keys";
import { Algorithm } from "@algorithms";
import { Language } from "@languages";

export function buildTracerRegistry(): TracerRegistry {
    const tracerRegistry = new TracerRegistry();

    tracerRegistry.register(tracerKey(Algorithm.BubbleSort, Language.TypeScript), 
        new BubbleSortArrayTracer(Language.TypeScript)
    );
    tracerRegistry.register(tracerKey(Algorithm.BubbleSort, Language.Python), 
        new BubbleSortArrayTracer(Language.Python)
    );

    tracerRegistry.register(tracerKey(Algorithm.SelectionSort, Language.TypeScript), 
        new SelectionSortArrayTracer(Language.TypeScript)
    );
    
    return tracerRegistry;
}
