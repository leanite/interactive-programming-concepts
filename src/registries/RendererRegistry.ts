import type { StructureType } from "@structures";
import type { IVisualRenderer } from "../renderers/IVisualRenderer";

/** Stores visual renderers keyed by structure kind (e.g., "array", "tree"). */
export class RendererRegistry {
  private readonly renderers = new Map<StructureType, IVisualRenderer<any>>();

  register<TState>(structure: StructureType, renderer: IVisualRenderer<TState>): void {
    this.renderers.set(structure, renderer as unknown as IVisualRenderer<any>);
  }

  get<TState>(structure: StructureType): IVisualRenderer<TState> {
    const renderer = this.renderers.get(structure);
    if (!renderer) throw new Error(`Renderer not found: ${structure}`);
    return renderer as IVisualRenderer<TState>;
  }
}