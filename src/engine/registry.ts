import type { IAlgorithmTracer } from "./IAlgorithmTracer";
import type { ILanguageAdapter } from "./ILanguageAdapter";
import type { IVisualRenderer } from "./IVisualRenderer";

type TracerKey = `${string}:${string}`; // example: "bubble-sort:typescript"
type RendererKey = string;              // example: "array" | "tree" | "graph"

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

/** Stores language adapters keyed by language id (e.g., "typescript"). */
export class LanguageRegistry {
  private readonly adapters = new Map<string, ILanguageAdapter>();

  register(languageId: string, adapter: ILanguageAdapter): void {
    this.adapters.set(languageId, adapter);
  }

  get(languageId: string): ILanguageAdapter {
    const adapter = this.adapters.get(languageId);
    if (!adapter) throw new Error(`Language adapter not found: ${languageId}`);
    return adapter;
  }
}

/** Stores visual renderers keyed by structure kind (e.g., "array", "tree"). */
export class RendererRegistry {
  private readonly renderers = new Map<RendererKey, IVisualRenderer<any>>();

  register<TState>(kind: RendererKey, renderer: IVisualRenderer<TState>): void {
    this.renderers.set(kind, renderer as unknown as IVisualRenderer<any>);
  }

  get<TState>(kind: RendererKey): IVisualRenderer<TState> {
    const renderer = this.renderers.get(kind);
    if (!renderer) throw new Error(`Renderer not found: ${kind}`);
    return renderer as IVisualRenderer<TState>;
  }
}