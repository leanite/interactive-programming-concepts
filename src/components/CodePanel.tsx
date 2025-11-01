import CodeViewer from "./CodeViewer";
import type { LanguageType } from "@types";
import type { SnippetKey } from "@keys";
import { useMemo } from "react";
import { registeredSnippets } from "@factories"

type Props = {
  language: LanguageType;
  snippetId: SnippetKey;
  highlight?: { start: number; end?: number };
};

export default function CodePanel({ language, snippetId, highlight }: Props) {
  const snippet = useMemo(() => registeredSnippets.get(snippetId), [snippetId]);

  return (
    <aside className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
      <header className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-80">Snippet: {snippetId}</span>
        <span className="text-sm opacity-80">Language: {language}</span>
      </header>

      {/* CHANGED: CodeViewer recebe o source pronto */}
      <CodeViewer language={language} snippet={snippet} highlight={highlight} />
    </aside>
  );
}