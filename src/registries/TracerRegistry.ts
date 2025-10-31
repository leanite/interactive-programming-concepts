import type { IAlgorithmTracer } from "@tracers";

type TracerKey = `${string}:${string}`; // example: "bubble-sort:typescript"

/**
 * Stores algorithm tracers keyed by "<algorithm-id>:<language>".
 * Example keys: "bubble-sort:typescript", "bst-search:python".
 */
export class TracerRegistry {
    private readonly tracers = new Map<TracerKey, IAlgorithmTracer<any>>();

    register(key: TracerKey, tracer: IAlgorithmTracer<any>): void {
        this.tracers.set(key, tracer);
    }

    get<TInitial>(key: TracerKey): IAlgorithmTracer<TInitial> {
        const tracer = this.tracers.get(key);
        if (!tracer) throw new Error(`Tracer not found: ${key}`);
        return tracer as IAlgorithmTracer<TInitial>;
    }
}