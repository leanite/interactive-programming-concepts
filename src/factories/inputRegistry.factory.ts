import { Algorithm } from "@algorithms";
import { InputRegistry } from "@registries";
import { createBubbleSortInput } from "@inputs";

export function buildInputRegistry(): InputRegistry {
    const inputRegistry = new InputRegistry();

    inputRegistry.registerInputGenerator<number[]>(Algorithm.BubbleSort, createBubbleSortInput);
    
    return inputRegistry;
}