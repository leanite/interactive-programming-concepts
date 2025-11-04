import type { StructureType } from "@structures";
import type { IVisualRenderer } from "../renderers/IVisualRenderer";
import { Structure } from "@structures";
import { ArrayRenderer, TreeRenderer } from "@renderers";

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

  /**
   * Builds the default RendererRegistry with built-in renderers.
   *
   * NOTE: This registry is DIFFERENT from the others (Tracer, Snippet, Input).
   *
   * ❓ Why not use the plugin system here?
   *
   * Renderers are registered by DATA STRUCTURE, not by algorithm:
   * - ArrayRenderer is used by ALL array algorithms (BubbleSort, QuickSort, etc)
   * - TreeRenderer is used by ALL tree algorithms (BSTSearch, AVLInsert, etc)
   *
   * Characteristics:
   * - Few renderers (array, tree, graph, stack, queue)
   * - Shared between multiple algorithms
   * - Stable (don't change frequently)
   * - Different abstraction (structure vs algorithm)
   *
   * To add a new data structure:
   * 1. Create renderer in src/renderers/
   * 2. Add Structure in src/types/structures.ts
   * 3. Register here
   *
   * Example: To add support for Graphs:
   * 1. Create GraphRenderer extends IVisualRenderer<GraphState>
   * 2. Add Structure.Graph = "graph"
   * 3. registry.register(Structure.Graph, new GraphRenderer())
   */
  static buildDefault(): RendererRegistry {
    const registry = new RendererRegistry();

    // Renderer for array structures (sorts, linear search, etc)
    registry.register(Structure.Array, new ArrayRenderer());

    // Renderer for binary trees (BST, AVL, heap, etc)
    registry.register(Structure.BST, new TreeRenderer());

    // TODO: Add GraphRenderer when implementing graph algorithms
    // registry.register(Structure.Graph, new GraphRenderer());

    return registry;
  }
}