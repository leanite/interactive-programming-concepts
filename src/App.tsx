import React from "react";
import TopBar from "./components/TopBar";
import Controls from "./components/Controls";
import Canvas from "./components/Canvas";
import CodePanel from "./components/CodePanel";
import StepInfo from "./components/StepInfo";
import { useStepRunner } from "./hooks/useStepRunner";
import { Language, LanguageCatalog, type LanguageId } from "./types/languages";
import type { StepSequence } from "./types/step";
import type { ArrayVisualState } from "./types/visual";
import { runner } from "./engine/bootstrap";
import { Structure } from "@structures";
import { Algorithm } from "@algorithms";

/**
 * Helper to create a fresh random numeric array (1..99) of a given length.
 * This is intentionally non-deterministic for now (no fixed seed).
 */
function createRandomArray(length: number): number[] {
  const values: number[] = [];
  for (let index = 0; index < length; index++) {
    values.push(Math.floor(Math.random() * 99) + 1);
  }
  return values;
}

export default function App() {
  const [language, setLanguage] = React.useState<LanguageId>(LanguageCatalog.default);

  // Base values for the algorithm visualization (random, created once on mount).
  const [baseValues, setBaseValues] = React.useState<number[]>(() => createRandomArray(8));

  // Steps produced by the engine (tracer) for the current baseValues and language.
  const [steps, setSteps] = React.useState<StepSequence>([]);

  // Build or rebuild the step trace whenever the language changes.
  // For now, we keep the Bubble Sort tracer keyed as "bubble-sort:typescript".
  React.useEffect(() => {
    const traceInfo = runner.buildTrace(Algorithm.BubbleSort, Language.TypeScript, baseValues);
    setSteps(traceInfo.steps);
  }, [language, baseValues]);

  // Playback engine (index, play/pause, step, prev, reset, speed).
  const stepRunner = useStepRunner({
    steps,
    initialIndex: 0,
    initialSpeedMs: 700,
  });

  // Code highlight derived from the current step's range.
  const highlight = stepRunner.current
    ? { start: stepRunner.current.lineStart, end: stepRunner.current.lineEnd }
    : undefined;

  // Visual state for the Canvas: reduce visual operations up to the current index.
  const visualState: ArrayVisualState = React.useMemo(() => {
    // Initial visual state for arrays is simply the base values,
    // with no focus on any index pair.
    const initialVisual: ArrayVisualState = { values: baseValues };

      // The structure kind for Bubble Sort on arrays is "array".
    return runner.computeVisualState<ArrayVisualState>(
      Structure.Array,
      initialVisual,
      steps,
      stepRunner.index
    );
  }, [baseValues, steps, stepRunner.index]);

  const handleRandomize = React.useCallback(() => {
    stepRunner.reset();                 // ensure playback state is consistent
    setBaseValues(createRandomArray(8)); // triggers trace rebuild via effect
  }, [stepRunner]);

  return (
    <div className="min-h-screen">
      <TopBar
        language={language}
        setLanguage={(newLanguage) => {
          setLanguage(newLanguage);
          stepRunner.reset();
        }}
      />

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4 p-4 sm:p-6">
        <section className="space-y-4">
          <Controls
            isPlaying={stepRunner.isPlaying}
            onPlayPause={stepRunner.togglePlay}
            onStep={stepRunner.step}
            onBack={stepRunner.back}
            onReset={stepRunner.reset}
            onRandomize={handleRandomize}
            speedMs={stepRunner.speedMs}
            onSpeedChange={stepRunner.setSpeedMs}
          />

          <StepInfo
            index={stepRunner.index}
            total={steps.length}
            note={stepRunner.current?.note ?? null}
          />

          <Canvas state={visualState} />
        </section>

        <CodePanel language={language} highlight={highlight} />
      </main>
    </div>
  );
}