import React from "react";
import TopBar from "./components/TopBar";
import Controls from "./components/Controls";
import Canvas from "./components/Canvas";
import CodePanel from "./components/CodePanel";
import StepInfo from "./components/StepInfo";
import { useStepRunner } from "./hooks/useStepRunner";
import { LanguageCatalog, type LanguageType } from "./types/languages";
import type { StepSequence } from "./types/step";
import type { ArrayVisualizationState } from "./types/visual";
import { runner } from "./engine/bootstrap";
import { Structure } from "@structures";
import { AlgorithmCatalog, type AlgorithmType } from "@algorithms";
import type { Snippet } from "@snippet";

export default function App() {
  const [algorithm, setAlgorithm] = React.useState<AlgorithmType>(AlgorithmCatalog.default);
  const [language, setLanguage] = React.useState<LanguageType>(LanguageCatalog.default);

  // Base values for the algorithm visualization (random, created once on mount).
  const [baseValues, setBaseValues] = React.useState<number[]>(() =>
    runner.generateInput<number[]>(AlgorithmCatalog.default)
  );

  // Steps produced by the engine (tracer) for the current baseValues and language.
  const [steps, setSteps] = React.useState<StepSequence>([]);

  // Snippet for the selected language and algorithm
  const [snippet, setSnippet] = React.useState<Snippet>(runner.getSnippet(algorithm, language));

  // Build or rebuild the step trace whenever the language changes.
  // For now, we keep the Bubble Sort tracer keyed as "bubble-sort:typescript".
  React.useEffect(() => {
    setSnippet(runner.getSnippet(algorithm, language));
    setSteps(runner.buildTrace(algorithm, language, baseValues));
  }, [algorithm, language, baseValues]);

  React.useEffect(() => {
    const generated = runner.generateInput<number[]>(algorithm);
    if (Array.isArray(generated)) {
      setBaseValues(generated);
    }
  }, [algorithm]);

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
  const visualState: ArrayVisualizationState = React.useMemo(() => {
    // Initial visual state for arrays is simply the base values,
    // with no focus on any index pair.
    const initialVisual: ArrayVisualizationState = { values: baseValues };

      // The structure kind for Bubble Sort on arrays is "array".
    return runner.computeVisualState<ArrayVisualizationState>(
      Structure.Array,
      initialVisual,
      steps,
      stepRunner.index
    );
  }, [baseValues, steps, stepRunner.index]);

  const handleRandomize = React.useCallback(() => {
    stepRunner.reset(); // ensure playback state is consistent
    setBaseValues(runner.generateInput<number[]>(algorithm)); // triggers trace rebuild via effect
  }, [algorithm, stepRunner]);

  return (
    <div className="min-h-screen">
      <TopBar
        language={language}
        setLanguage={(newLang) => {
          setLanguage(newLang);
          stepRunner.reset();
        }}
        algorithm={algorithm}                 
        setAlgorithm={(newAlg) => {
          setAlgorithm(newAlg);
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

        <CodePanel snippet={snippet} highlight={highlight} />
      </main>
    </div>
  );
}
