import Prism from "prismjs";
import { useMemo } from "react";
import type { Snippet } from "@snippet";

// Base dependency for C/Java languages
import "prismjs/components/prism-clike";

// Import languages supported
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-rust";

// Theme
import "prismjs/themes/prism-tomorrow.css";

type Props = {
  snippet: Snippet;
  highlight?: { start: number; end?: number }; // 1-based inclusive range
};

export default function CodeViewer({ snippet, highlight }: Props) {
  // Precompute grammar; fallback to TS if missing
  const grammar = useMemo(() => {
    // Guard: ensure grammar exists (e.g., if a language import changes)
    return Prism.languages[snippet.language] ?? Prism.languages.typescript;
  }, [snippet.language]);

  // Split code into individual lines to render gutters + per-line highlight
  const codeText = snippet.text ?? "";
  const lines = useMemo(() => codeText.split("\n"), [codeText]);

  const start = highlight?.start ?? -1;
  const end = highlight?.end ?? start;

  return (
    <div
      className="relative font-mono text-sm overflow-auto"
      role="region"
      aria-label="Code viewer with line numbers"
    >
      {/* Using a semantic <pre> but we render lines ourselves for better control */}
      <pre className={`language-${snippet.language} m-0`}>
        <code className="block">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const active = lineNum >= start && lineNum <= end;

            return (
              <div
                key={idx}
                className={`flex gap-3 pr-4 whitespace-pre leading-6 ${
                  active ? "bg-cyan-500/10" : ""
                }`}
              >
                {/* Gutter: line number column (decorative) */}
                <div
                  className="select-none text-right w-10 shrink-0 pl-3 pr-1 text-neutral-500"
                  aria-hidden="true"
                  title={`Line ${lineNum}`}
                >
                  {lineNum}
                </div>

                {/* Code content: highlighted per-line */}
                <div className="min-w-0">
                  <span
                    // NOTE: Highlight per-line to preserve alignment with gutter
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(line || " ", grammar, snippet.language),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}