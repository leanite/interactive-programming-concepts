import type { StructureId } from "@structures";
import type { IVisualRenderer } from "../renderers/IVisualRenderer";

/** Stores visual renderers keyed by structure kind (e.g., "array", "tree"). */
export class RendererRegistry {
  private readonly renderers = new Map<StructureId, IVisualRenderer<any>>();

  register<TState>(kind: StructureId, renderer: IVisualRenderer<TState>): void {
    this.renderers.set(kind, renderer as unknown as IVisualRenderer<any>);
  }

  get<TState>(kind: StructureId): IVisualRenderer<TState> {
    const renderer = this.renderers.get(kind);
    if (!renderer) throw new Error(`Renderer not found: ${kind}`);
    return renderer as IVisualRenderer<TState>;
  }
}