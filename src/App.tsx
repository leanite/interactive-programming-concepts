import React, { useMemo } from "react";
import TopBar from "./components/TopBar";
import Controls from "./components/Controls";
import Canvas from "./components/Canvas";
import CodePanel from "./components/CodePanel";
import { useStepRunner } from "./hooks/useStepRunner";
import type { Step, Language } from "@types";

export default function App() {
  // App holds the current language state (kept from previous commit)
  const [language, setLanguage] = React.useState<Language>("typescript");

  // Demo steps per language (will be replaced later by JSON/YAML input)
  const steps = useMemo<Step[]>(() => {
    // For the demo, highlight a few meaningful blocks per snippet.
    // These line numbers assume the current sample snippets in CodePanel.
    switch (language) {
      case "java":
        return [
          { lineStart: 1, note: "Class declaration" },
          { lineStart: 2, lineEnd: 12, note: "bubbleSort method" },
          { lineStart: 6, lineEnd: 10, note: "inner loop & swap" },
        ];
      case "python":
        return [
          { lineStart: 1, note: "Function def" },
          { lineStart: 2, lineEnd: 5, note: "nested loops" },
          { lineStart: 5, lineEnd: 6, note: "swap & return" },
        ];
      case "c":
        return [
          { lineStart: 1, note: "Function signature" },
          { lineStart: 2, lineEnd: 8, note: "nested loops" },
          { lineStart: 4, lineEnd: 7, note: "comparison & swap" },
        ];
      case "rust":
        return [
          { lineStart: 1, note: "Function signature" },
          { lineStart: 2, lineEnd: 9, note: "loops over indices" },
          { lineStart: 5, lineEnd: 8, note: "swap" },
        ];
      default:
        // typescript
        return [
          { lineStart: 1, note: "Function signature" },
          { lineStart: 2, lineEnd: 12, note: "outer & inner loops" },
          { lineStart: 6, lineEnd: 10, note: "comparison & swap" },
        ];
    }
  }, [language]);

  const runner = useStepRunner({
    steps,
    initialIndex: 0,
    initialSpeedMs: 700,
  });

  // Compute highlight range for CodePanel based on current step
  const highlight = runner.current
    ? { start: runner.current.lineStart, end: runner.current.lineEnd }
    : undefined;

  return (
    <div className="min-h-screen">
      <TopBar language={language} setLanguage={(l) => {
        setLanguage(l);
        // Reset steps when changing language
        runner.reset();
      }} />

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4 p-4 sm:p-6">
        <section className="space-y-4">
          <Controls
            isPlaying={runner.isPlaying}
            onPlayPause={runner.togglePlay}
            onStep={runner.step}
            onReset={runner.reset}
            speedMs={runner.speedMs}
            onSpeedChange={runner.setSpeedMs}
          />
          <Canvas />
        </section>

        <CodePanel language={language} highlight={highlight} />
      </main>
    </div>
  );
}
