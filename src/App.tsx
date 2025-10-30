import yaml from "js-yaml";
import { useState, useEffect, useMemo } from "react";
import TopBar from "./components/TopBar";
import Controls from "./components/Controls";
import StepInfo from "./components/StepInfo";
import Canvas from "./components/Canvas";
import CodePanel from "./components/CodePanel";
import { computeArrayState } from "./lib/arrayState";
import { useStepRunner } from "./hooks/useStepRunner";
import type { StepSequence, StepFile, Language, VisualizationState } from "@types";
import type { ArrayOperation } from "@operations";

export default function App() {
  // App holds the current language state (kept from previous commit)
  const [language, setLanguage] = useState<Language>("typescript");
  const [yamlSteps, setYamlSteps] = useState<StepSequence>([]);

  const baseValues = useMemo<number[]>(
    () => [12, 80, 40, 64, 32, 96, 20, 72],
    []
  );

  // Demo ops per step for the base array; one small op each step.
  // Later this comes from YAML alongside step notes/highlights.
  const arrayOperationsByStep = useMemo<ArrayOperation[]>(() => [
    { kind: "array/compare", i: 0, j: 1 },
    { kind: "array/swap", i: 0, j: 1 },
    { kind: "array/compare", i: 2, j: 3 },
    { kind: "array/swap", i: 2, j: 3 },
    { kind: "array/compare", i: 3, j: 4 },
    { kind: "array/compare", i: 5, j: 6 },
    { kind: "array/swap", i: 5, j: 6 },
    { kind: "array/compare", i: 6, j: 7 },
  ], []);

  useEffect(() => {
    let active = true;

    async function loadStepsFromYaml() {
      if (language === "typescript") {
        try {
          const res = await fetch("/src/data/steps/bubbleSort.typescript.yml");
          const text = await res.text();
          const parsed = yaml.load(text) as StepFile; 
          const parsedSteps = Array.isArray(parsed?.steps) ? parsed.steps as StepSequence : [];

          if (active) setYamlSteps(parsedSteps);
        } catch (err) {
          console.error("Failed to load YAML config:", err);
          if (active) {
            setYamlSteps([
              { lineStart: 1, note: "Function signature" },
              { lineStart: 2, lineEnd: 12, note: "outer & inner loops" },
              { lineStart: 6, lineEnd: 10, note: "comparison & swap" },
            ]);
          }
        }
      } else {
        const defaults: StepSequence =
          language === "java"
            ? [
                { lineStart: 1, note: "Class declaration" },
                { lineStart: 2, lineEnd: 12, note: "bubbleSort method" },
                { lineStart: 6, lineEnd: 10, note: "inner loop & swap" },
              ]
            : language === "python"
            ? [
                { lineStart: 1, note: "Function def" },
                { lineStart: 2, lineEnd: 5, note: "nested loops" },
                { lineStart: 5, lineEnd: 6, note: "swap & return" },
              ]
            : language === "c"
            ? [
                { lineStart: 1, note: "Function signature" },
                { lineStart: 2, lineEnd: 8, note: "nested loops" },
                { lineStart: 4, lineEnd: 7, note: "comparison & swap" },
              ]
            : [
                { lineStart: 1, note: "Function signature" },
                { lineStart: 2, lineEnd: 9, note: "loops over indices" },
                { lineStart: 5, lineEnd: 8, note: "swap" },
              ];

        if (active) setYamlSteps(defaults);
      }
    }

    loadStepsFromYaml();
    return () => {
      active = false;
    };
  }, [language]);

  const memoSteps: StepSequence = useMemo(() => {
    const opsLen = arrayOperationsByStep.length;
    const yamlLen = yamlSteps.length;
    const total = Math.max(opsLen, yamlLen);

    const stepsList: StepSequence = Array.from({ length: total }, (_, i) => {
      const y = yamlSteps[i];
      if (y) return y;
      
      return { lineStart: 1, note: undefined };
    });

    return stepsList;
  }, [yamlSteps, arrayOperationsByStep.length]);

  const runner = useStepRunner({
    steps: memoSteps,
    initialIndex: 0,
    initialSpeedMs: 700,
  });

  const visualState: VisualizationState = useMemo(() => {
    if (baseValues.length === 0) return { values: [] };
  
    // Replay ops up to current step index
    const opsToApply: ArrayOperation[] = arrayOperationsByStep.slice(0, Math.min(runner.index + 1, arrayOperationsByStep.length));
    const result = computeArrayState(baseValues, opsToApply);
  
    return {
      values: result.values,
      focus: result.focus,
    };
  }, [runner.index, baseValues, arrayOperationsByStep]);

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
            onBack={runner.back} 
            onReset={runner.reset}
            speedMs={runner.speedMs}
            onSpeedChange={runner.setSpeedMs}
          />

          <StepInfo
            index={runner.index}
            total={memoSteps.length}
            note={runner.current?.note ?? null}
          />

          <Canvas state={visualState} />
        </section>

        <CodePanel language={language} highlight={highlight} />
      </main>
    </div>
  );
}
