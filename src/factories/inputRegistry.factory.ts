import { Algorithm } from "@algorithms";
import { InputRegistry } from "@registries";
import { createArraySortInput } from "@inputs";

export function buildInputRegistry(): InputRegistry {
    const inputRegistry = new InputRegistry();

    inputRegistry.registerInputGenerator<number[]>(Algorithm.BubbleSort, createArraySortInput);
    inputRegistry.registerInputGenerator<number[]>(Algorithm.SelectionSort, createArraySortInput);
    
    return inputRegistry;
}