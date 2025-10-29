import { useMemo } from "react";
import Prism from "prismjs";

// Import languages supported
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-rust";

// Theme
import "prismjs/themes/prism-tomorrow.css";

type Language = "typescript" | "python" | "java" | "c" | "rust";

type Props = {
  language: Language;
  code: string;
  highlight?: { start: number; end?: number }; // highlight range (1-based)
};

export default function CodeViewer({ language, code, highlight }: Props) {
  // Create highlighted HTML from code
  const highlighted = useMemo(() => {
    const grammar = Prism.languages[language] || Prism.languages.typescript;
    return Prism.highlight(code, grammar, language);
  }, [code, language]);

  const lines = code.split("\n");
  const start = highlight?.start ?? -1;
  const end = highlight?.end ?? start;

  return (
    <div className="relative font-mono text-sm overflow-auto">
      <pre className={`language-${language} m-0`}>
        <code>
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const active = lineNum >= start && lineNum <= end;
            return (
              <div
                key={idx}
                className={`px-4 whitespace-pre ${
                  active ? "bg-cyan-500/10" : ""
                }`}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      line,
                      Prism.languages[language],
                      language
                    ),
                  }}
                />
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}