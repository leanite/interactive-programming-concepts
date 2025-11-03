import CodeViewer from "./CodeViewer";
import type { Snippet } from "@snippet";

type Props = {
  snippet: Snippet;
  highlight?: { start: number; end?: number };
};

export default function CodePanel({ snippet, highlight }: Props) {

  return (
    <div className="h-full flex flex-col theme-panel">
      <div className="flex items-center justify-between px-2 py-1" style={{ borderBottom: "1px solid var(--panel-border)" }}>
        <span className="text-xs" style={{ color: "var(--muted)" }}>Snippet: {snippet.algorithm}</span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>Language: {snippet.language}</span>
      </div>

      <CodeViewer snippet={snippet} highlight={highlight} />
    </div>
  );
}