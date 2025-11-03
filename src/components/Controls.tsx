type Props = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStep: () => void;
  onBack: () => void;
  onReset: () => void;
  onRandomize: () => void;
  speedMs: number;
  onSpeedChange: (ms: number) => void;
};

export default function Controls({
  isPlaying,
  onPlayPause,
  onStep,
  onBack,
  onReset,
  onRandomize,
  speedMs,
  onSpeedChange,
}: Props) {
  // Map slider [0..100] to milliseconds (e.g., 200..1500ms)
  const sliderValue = msToSlider(speedMs);

  return (
    <div className="theme-panel p-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Randomize button */}
        <button
          type="button"
          onClick={onRandomize}
          className="px-3 py-1.5 rounded-lg border"
          style={{ background: "var(--panel-bg)", borderColor: "var(--panel-border)", color: "var(--fg-default)" }}
        >
          Randomize
        </button>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg border"
          style={{ background: "var(--panel-bg)", borderColor: "var(--panel-border)", color: "var(--fg-default)" }}
        >
          Reset
        </button>

        {/* Prev */}
        <button
          type="button"
          onClick={onBack}
          disabled={isPlaying}
          title={isPlaying ? "Pause to navigate manually" : "Go back one step"}
          className="px-3 py-1.5 rounded-lg border disabled:opacity-60"
          style={{ background: "var(--panel-bg)", borderColor: "var(--panel-border)", color: "var(--fg-default)" }}
        >
          Prev
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          onClick={onPlayPause}
          className="px-3 py-1.5 rounded-lg"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Step forward */}
        <button
          type="button"
          onClick={onStep}
          disabled={isPlaying}
          title={isPlaying ? "Pause to step manually" : "Step once"}
          className="px-3 py-1.5 rounded-lg border disabled:opacity-60"
          style={{ background: "var(--panel-bg)", borderColor: "var(--panel-border)", color: "var(--fg-default)" }}
        >
          Step
        </button>

        <div className="mx-2" style={{ width: 1, height: 24, background: "var(--panel-border)" }} />

        {/* Speed control */}
        <label className="text-sm opacity-80 flex items-center gap-2" style={{ color: "var(--fg-default)" }}>
          <span>Speed</span>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => onSpeedChange(sliderToMs(Number(e.target.value)))}
            className="align-middle"
            style={{ accentColor: "var(--accent)" }}
          />
        </label>
      </div>
    </div>
  );
}

// Map 0..100 to 200..1500ms (lower slider = faster)
function sliderToMs(v: number) {
  const min = 200;
  const max = 1500;
  const t = v / 100; // 0..1
  return Math.round(min + (max - min) * t);
}

function msToSlider(ms: number) {
  const min = 200;
  const max = 1500;
  const clamped = Math.min(max, Math.max(min, ms));
  return Math.round(((clamped - min) / (max - min)) * 100);
}