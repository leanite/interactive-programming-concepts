import CodeViewer from "./CodeViewer";
import type { AlgorithmType, LanguageType } from "@types";
import type { SnippetPath } from "@registries";

type Props = {
  algorithm: AlgorithmType
  language: LanguageType;
  snippet: SnippetPath;
  highlight?: { start: number; end?: number };
};

export default function CodePanel({ algorithm, language, snippet, highlight }: Props) {

  return (
    <aside className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
      <header className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-80">Snippet: {algorithm}:{language}</span>
        <span className="text-sm opacity-80">Language: {language}</span>
      </header>

      {/* CHANGED: CodeViewer recebe o source pronto */}
      <CodeViewer language={language} snippet={snippet} highlight={highlight} />
    </aside>
  );
}