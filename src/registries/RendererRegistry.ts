import type { IVisualRenderer } from "../renderers/IVisualRenderer";

type RendererKey = string;              // example: "array" | "tree" | "graph"

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