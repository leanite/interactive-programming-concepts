import { Algorithm } from "@algorithms";
import { InputRegistry } from "@registries";
import { createArraySortInput, generateBSTInput } from "@inputs";
import type { BSTSearchInput } from "@inputs";

export function buildInputRegistry(): InputRegistry {
    const inputRegistry = new InputRegistry();

    inputRegistry.registerInputGenerator<number[]>(Algorithm.BubbleSort, createArraySortInput);
    inputRegistry.registerInputGenerator<number[]>(Algorithm.SelectionSort, createArraySortInput);

    inputRegistry.registerInputGenerator<BSTSearchInput>(Algorithm.BSTSearch, generateBSTInput);
    return inputRegistry;
}
