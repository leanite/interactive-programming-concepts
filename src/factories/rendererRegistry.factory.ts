import { RendererRegistry } from "@registries";
import { ArrayRenderer } from "@renderers";

export function buildRendererRegistry(): RendererRegistry {
    const rendererRegistry = new RendererRegistry();

    rendererRegistry.register("array", new ArrayRenderer());
    
    return rendererRegistry;
}