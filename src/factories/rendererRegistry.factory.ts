import { RendererRegistry } from "@registries";
import { ArrayRenderer, TreeRenderer } from "@renderers";
import { Structure } from "@structures";

export function buildRendererRegistry(): RendererRegistry {
    const rendererRegistry = new RendererRegistry();

    rendererRegistry.register(Structure.Array, new ArrayRenderer());
    rendererRegistry.register(Structure.BST, new (TreeRenderer));
    
    return rendererRegistry;
}