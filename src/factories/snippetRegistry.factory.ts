// Snippet registry singleton that self-registers available snippet sources.
import { SnippetRegistry } from "@registries";
import { snippetKey } from "@keys";
import { Algorithm } from "@algorithms";
import { Language } from "@languages";

// Raw .txt snippets organized by language folder:
import bubbleSortTs from "@snippets-dir/typescript/bubble-sort.txt?raw";

export function buildSnippetRegistry(): SnippetRegistry {
    const snippetRegistry = new SnippetRegistry();

    snippetRegistry.register(snippetKey(Algorithm.BubbleSort, Language.TypeScript), bubbleSortTs);

    return snippetRegistry
}