import type { IAlgorithmTracer } from "@tracers";
import type { TracerKey } from "@keys";

/**
 * Stores algorithm tracers keyed by "<algorithm-id>:<language>".
 * Example keys: "bubble-sort:typescript", "bst-search:python".
 */
export class TracerRegistry {
    private readonly tracers = new Map<TracerKey, IAlgorithmTracer<any>>();

    register(key: TracerKey, tracer: IAlgorithmTracer<any>): void {
        this.tracers.set(key, tracer);
    }

    get<T>(key: TracerKey): IAlgorithmTracer<T> {
        const tracer = this.tracers.get(key);
        if (!tracer) throw new Error(`Tracer not found: ${key}`);
        return tracer as IAlgorithmTracer<T>;
    }
}