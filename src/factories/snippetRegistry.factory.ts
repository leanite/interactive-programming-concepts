// Snippet registry singleton that self-registers available snippet sources.
import { SnippetRegistry } from "@registries";
import { formatUniqueKey } from "@keys";
import { Algorithm } from "@algorithms";
import { Language } from "@languages";
import { Snippet } from "@snippet";
import { bubbleSortPythonRanges, bubbleSortTypeScriptRanges, selectionSortTypeScriptRanges } from "@snippets-file";

// Raw .txt snippets organized by algorithm folder:
import bubbleSortTypescriptSnippetText from "@snippets-dir/bubble-sort/bubble-sort.typescript.txt?raw";
import bubbleSortPythonSnippetText from "@snippets-dir/bubble-sort/bubble-sort.python.txt?raw";
import selectionSortTypescriptSnippetText from "@snippets-dir/selection-sort/selection-sort.typescript.txt?raw";

export function buildSnippetRegistry(): SnippetRegistry {
    const snippetRegistry = new SnippetRegistry();

    snippetRegistry.register(formatUniqueKey(Algorithm.BubbleSort, Language.TypeScript), 
        new Snippet(Algorithm.BubbleSort, Language.TypeScript, bubbleSortTypescriptSnippetText, bubbleSortTypeScriptRanges));

    snippetRegistry.register(formatUniqueKey(Algorithm.BubbleSort, Language.Python), 
        new Snippet(Algorithm.BubbleSort, Language.Python, bubbleSortPythonSnippetText, bubbleSortPythonRanges));
    
    snippetRegistry.register(formatUniqueKey(Algorithm.SelectionSort, Language.TypeScript), 
        new Snippet(Algorithm.SelectionSort, Language.TypeScript, selectionSortTypescriptSnippetText, selectionSortTypeScriptRanges));
    return snippetRegistry
}