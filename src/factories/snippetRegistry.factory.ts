// Snippet registry singleton that self-registers available snippet sources.
import { SnippetRegistry } from "@registries";
import { formatUniqueKey } from "@keys";
import { Algorithm } from "@algorithms";
import { Language } from "@languages";
import { Snippet } from "@snippet";
import { bubbleSortTypeScriptRanges } from "@snippets-file";

// Raw .txt snippets organized by language folder:
import bubbleSortTypescriptSnippetText from "@snippets-dir/typescript/bubble-sort.txt?raw";

export function buildSnippetRegistry(): SnippetRegistry {
    const snippetRegistry = new SnippetRegistry();

    snippetRegistry.register(formatUniqueKey(Algorithm.BubbleSort, Language.TypeScript), 
        new Snippet(Algorithm.BubbleSort, Language.TypeScript, bubbleSortTypescriptSnippetText, bubbleSortTypeScriptRanges));
        //TODO: definir como o Range entra aqui e sucesso! não acho que vale a pena criar RangeRegistry
    return snippetRegistry
}