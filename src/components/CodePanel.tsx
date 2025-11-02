import CodeViewer from "./CodeViewer";
import type { Snippet } from "@snippet";

type Props = {
  snippet: Snippet;
  highlight?: { start: number; end?: number };
};

export default function CodePanel({ snippet, highlight }: Props) {

  return (
    <aside className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
      <header className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-80">Snippet: {snippet.algorithm}:{snippet.language}</span>
        <span className="text-sm opacity-80">Language: {snippet.language}</span>
      </header>

      <CodeViewer snippet={snippet} highlight={highlight} />
    </aside>
  );
}