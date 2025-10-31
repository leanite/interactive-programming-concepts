import { RendererRegistry } from "@registries";
import { ArrayRenderer } from "@renderers";
import { Structure } from "@structures";

export function buildRendererRegistry(): RendererRegistry {
    const rendererRegistry = new RendererRegistry();

    rendererRegistry.register(Structure.Array, new ArrayRenderer());
    
    return rendererRegistry;
}