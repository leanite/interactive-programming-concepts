// Snippet registry singleton that self-registers available snippet sources.
import { SnippetRegistry } from "@registries";
import { formatUniqueKey } from "@keys";
import { Algorithm } from "@algorithms";
import { Language } from "@languages";
import { Snippet } from "@snippet";
import { bubbleSortTypeScriptRanges } from "@snippets-file";

// Raw .txt snippets organized by language folder:
import bubbleSortTypescriptSnippetText from "@snippets-dir/typescript/bubble-sort.txt?raw";
import selectionSortTypescriptSnippetText from "@snippets-dir/typescript/selection-sort.txt?raw";

import { selectionSortTypeScriptRanges } from "@tracers";

export function buildSnippetRegistry(): SnippetRegistry {
    const snippetRegistry = new SnippetRegistry();

    snippetRegistry.register(formatUniqueKey(Algorithm.BubbleSort, Language.TypeScript), 
        new Snippet(Algorithm.BubbleSort, Language.TypeScript, bubbleSortTypescriptSnippetText, bubbleSortTypeScriptRanges));
    
    snippetRegistry.register(formatUniqueKey(Algorithm.SelectionSort, Language.TypeScript), 
        new Snippet(Algorithm.SelectionSort, Language.TypeScript, selectionSortTypescriptSnippetText, selectionSortTypeScriptRanges));
    return snippetRegistry
}