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

// Theme (Prism)
import "prismjs/themes/prism-tomorrow.css";
import "../ui/styles/prism-theme.css";

type Props = {
  snippet: Snippet;
  highlight?: { start: number; end?: number }; // 1-based inclusive range
};

export default function CodeViewer({ snippet, highlight }: Props) {
  // Precompute grammar; fallback to TS if missing
  const grammar = useMemo(() => {
    return Prism.languages[snippet.language] ?? Prism.languages.typescript;
  }, [snippet.language]);

  // Normalize line endings and split into lines
  const lines = useMemo(() => {
    const codeText = snippet.text ?? "";

    // Guard against empty or undefined text
    if (!codeText || codeText.length === 0) {
      return [""];
    }

    // Normalize line endings: handle \r\n (Windows) and \r (old Mac)
    const normalized = codeText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Split by newline
    const split = normalized.split("\n");

    // Guard against empty split result
    return split.length > 0 ? split : [""];
  }, [snippet.text]);

  const start = highlight?.start ?? -1;
  const end = highlight?.end ?? start;

  return (
    <div
      className="relative font-mono text-sm overflow-auto"
      role="region"
      aria-label="Code viewer with line numbers"
      style={{ color: "var(--fg-default)" }}
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
                  className={`flex gap-3 pr-4 whitespace-pre leading-6 ${active ? "line-active" : ""}`}
                >
                {/* Gutter: line number column (decorative) */}
                <div
                  className="select-none text-right w-10 shrink-0 pl-3 pr-1"
                  aria-hidden="true"
                  title={`Line ${lineNum}`}
                  style={{ color: "var(--muted)" }}
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