import { useMemo } from "react";
import Prism from "prismjs";

import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-rust";

import "prismjs/themes/prism-tomorrow.css";

type Language = "typescript" | "python" | "java" | "c" | "rust";

type Props = {
  language: Language;
  code: string;
};

export default function CodeViewer({ language, code }: Props) {
  // Proccess highlight only when code/language change
  const highlighted = useMemo(() => {
    const grammar = Prism.languages[language] || Prism.languages.typescript;
    return Prism.highlight(code, grammar, language);
  }, [code, language]);

  return (
    <pre className={`language-${language} m-0 p-4 overflow-auto`}>
      {/* Prism returns a styled HTML */}
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}