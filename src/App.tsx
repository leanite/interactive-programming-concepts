import React from "react";
import TopBar from "./components/TopBar";
import Controls from "./components/Controls";
import Canvas from "./components/Canvas";
import TreeCanvas from "./components/TreeCanvas";
import GraphCanvas from "./components/GraphCanvas";
import CodePanel from "./components/CodePanel";
import StepInfo from "./components/StepInfo";
import { useStepRunner } from "./hooks/useStepRunner";
import { LanguageCatalog, type LanguageType } from "./types/languages";
import type { StepSequence } from "./types/step";
import type { ArrayVisualizationState, TreeVisualizationState, GraphVisualizationState } from "./types/visual";
import { runner } from "./engine/bootstrap";
import { Structure, type StructureType } from "@structures";
import { AlgorithmCatalog, type AlgorithmType } from "@algorithms";
import type { Snippet } from "@snippet";
import { useTheme } from "@hooks";
import type { AlgorithmInput } from "@inputs";

// NEW: resizable sidebar hook (local, minimal)
function useResizableSidebar(options?: {
  storageKey?: string;
  min?: number;
  max?: number;
  initial?: number;
  enable?: boolean;
}) {
  const storageKey = options?.storageKey ?? "ipc:sidebarWidth";
  const min = options?.min ?? 320;
  const max = options?.max ?? 720;
  const initial = options?.initial ?? 420;
  const enable = options?.enable ?? true;

  const [width, setWidth] = React.useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? parseInt(saved, 10) : initial;
      return Math.max(min, Math.min(max, isNaN(parsed) ? initial : parsed));
    } catch {
      return initial;
    }
  });

  const draggingRef = React.useRef(false);
  const containerRightRef = React.useRef(0);

  const startDrag = React.useCallback((containerRight: number) => {
    if (!enable) return;
    draggingRef.current = true;
    containerRightRef.current = containerRight;
  }, [enable]);

  const onMove = React.useCallback((clientX: number) => {
    if (!draggingRef.current || !enable) return;
    const newWidth = Math.max(min, Math.min(max, containerRightRef.current - clientX));
    setWidth(newWidth);
  }, [enable, min, max]);

  const stopDrag = React.useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try { localStorage.setItem(storageKey, String(width)); } catch {}
  }, [storageKey, width]);

  React.useEffect(() => {
    if (!enable) return;
    const mm = (e: MouseEvent) => onMove(e.clientX);
    const mu = () => stopDrag();
    const tm = (e: TouchEvent) => { if (e.touches[0]) onMove(e.touches[0].clientX); };
    const tu = () => stopDrag();

    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", tu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", tm as any);
      window.removeEventListener("touchend", tu);
    };
  }, [enable, onMove, stopDrag]);

  return { width, setWidth, startDrag, isEnabled: enable, min, max } as const;
}

export default function App() {
  const [algorithm, setAlgorithm] = React.useState<AlgorithmType>(AlgorithmCatalog.default);
  const [language, setLanguage] = React.useState<LanguageType>(LanguageCatalog.default);
  const [structure, setStructure] = React.useState<StructureType>(Structure.Array); //TODO: melhorar esse default
  const [theme, toggleTheme] = useTheme();

  // Base values for the algorithm visualization (random, created once on mount).
  const [baseValues, setBaseValues] = React.useState<AlgorithmInput>(() =>
    runner.generateInput<AlgorithmInput>(AlgorithmCatalog.default)
  );

  // Steps produced by the engine (tracer) for the current baseValues and language.
  const [steps, setSteps] = React.useState<StepSequence>([]);

  // Snippet for the selected language and algorithm
  const [snippet, setSnippet] = React.useState<Snippet>(runner.getSnippet(algorithm, language));

  // When algorithm changes, regenerate input from engine FIRST
  React.useEffect(() => {
    setBaseValues(runner.generateInput<AlgorithmInput>(algorithm));
  }, [algorithm]);

  // Rebuild snippet + steps whenever inputs change
  React.useEffect(() => {
    if (!baseValues) return;
    const result = runner.buildTrace(algorithm, language, baseValues as any)
    setSnippet(runner.getSnippet(algorithm, language));
    setStructure(result.structure);
    setSteps(result.steps);
  }, [algorithm, language, baseValues]);

  // Playback engine (index, play/pause, step, prev, reset, speed).
  const stepRunner = useStepRunner({ steps, initialIndex: 0, initialSpeedMs: 700 });

  // Code highlight derived from the current step's range.
  const highlight = stepRunner.current
    ? { start: stepRunner.current.lineStart, end: stepRunner.current.lineEnd }
    : undefined;

  // Visual state for the Canvas: reduce visual operations up to the current index.
  const visualState = React.useMemo(() => {
    if (structure === Structure.Array) {
      const initial: ArrayVisualizationState = { values: baseValues as number[] };
      return runner.computeVisualState(Structure.Array, initial, steps, stepRunner.index);
    } else if (structure === Structure.BST) {
      const initial: TreeVisualizationState = { root: (baseValues as any).root ?? null, compareKey: (baseValues as any).key };
      return runner.computeVisualState(Structure.BST, initial, steps, stepRunner.index);
    } else if (structure === Structure.Graph) {
      const initial: GraphVisualizationState = { graph: (baseValues as any).graph };
      return runner.computeVisualState(Structure.Graph, initial, steps, stepRunner.index);
    }
    return null;
  }, [baseValues, steps, stepRunner.index, structure]);

  const handleRandomize = React.useCallback(() => {
    stepRunner.reset();
    setBaseValues(runner.generateInput<AlgorithmInput>(algorithm));
  }, [algorithm, stepRunner]);

  // Responsive enable: only allow resize on wide viewports (>= 1024px)
  const [isWide, setIsWide] = React.useState<boolean>(() => window.innerWidth >= 1024);
  React.useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { width: sidebarWidth, startDrag, isEnabled } = useResizableSidebar({
    initial: 420,
    min: 320,
    max: 720,
    enable: isWide,
  });

  const mainStyle = isEnabled
    ? { display: "grid", gridTemplateColumns: `1fr 8px ${sidebarWidth}px`, columnGap: 0, rowGap: "1rem" }
    : { display: "grid", gridTemplateColumns: "1fr", columnGap: 0, rowGap: "1rem" };

  return (
    <div className="min-h-screen">
      <TopBar
        language={language}
        setLanguage={(newLang) => { setLanguage(newLang); stepRunner.reset(); }}
        algorithm={algorithm}
        setAlgorithm={(newAlg) => { setAlgorithm(newAlg); stepRunner.reset(); }}
        theme={theme}
        onToggleTheme={() => toggleTheme()}
      />

      <main className="p-4 sm:p-6" style={mainStyle}>
        {/* Main column */}
        <section className="space-y-2">
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

          <StepInfo index={stepRunner.index} total={steps.length} note={stepRunner.current?.note ?? null} />

          {structure === Structure.Array ? (
            <Canvas state={visualState as ArrayVisualizationState} />
          ) : structure === Structure.BST ? (
            <TreeCanvas state={visualState as TreeVisualizationState} />
          ) : structure === Structure.Graph ? (
            <GraphCanvas state={visualState as GraphVisualizationState} />
          ) : null}
        </section>

        {/* Handle + Sidebar on wide screens */}
        {isEnabled && (
          <>
            <div
              className="resize-handle"
              style={{ height: "100%" }}
              onMouseDown={(e) => {
                const parent = e.currentTarget.parentElement;
                const right = parent ? parent.getBoundingClientRect().right : window.innerWidth;
                startDrag(right);
              }}
              onTouchStart={(e) => {
                const parent = e.currentTarget.parentElement;
                const right = parent ? parent.getBoundingClientRect().right : window.innerWidth;
                startDrag(right);
              }}
              title="Drag to resize code panel"
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize code panel"
            />
            <aside>
              <CodePanel snippet={snippet} highlight={highlight} />
            </aside>
          </>
        )}

        {/* Stacked sidebar on narrow screens */}
        {!isEnabled && (
          <aside className="mt-4">
            <CodePanel snippet={snippet} highlight={highlight} />
          </aside>
        )}
      </main>
    </div>
  );
}
