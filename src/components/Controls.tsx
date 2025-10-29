type Props = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStep: () => void;
  onBack: () => void;
  onReset: () => void;
  speedMs: number;
  onSpeedChange: (ms: number) => void;
};

export default function Controls({
  isPlaying,
  onPlayPause,
  onStep,
  onBack,
  onReset,
  speedMs,
  onSpeedChange,
}: Props) {
  // Map slider [0..100] to milliseconds (e.g., 200..1500ms)
  const sliderValue = msToSlider(speedMs);

  return (
    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
      <div className="flex flex-wrap items-center gap-2">
        {/* Reset button */}
        <button
          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700"
          onClick={onReset}
        >
          Reset
        </button>

        {/* Prev */}
        <button
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700"
            onClick={onBack}
            disabled={isPlaying}
            title={isPlaying ? "Pause to navigate manually" : "Go back one step"}
          >
          Prev
        </button>

        {/* Play / Pause */}
        <button
          className="px-3 py-1.5 rounded-lg bg-blue-500/90 hover:bg-blue-500"
          onClick={onPlayPause}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Step forward */}
        <button
          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700"
          onClick={onStep}
          disabled={isPlaying}
          title={isPlaying ? "Pause to step manually" : "Step once"}
        >
          Step
        </button>

        <div className="w-px h-6 bg-neutral-800 mx-2" />

        {/* Speed control */}
        <label className="text-sm opacity-80 flex items-center gap-2">
          <span>Speed</span>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => onSpeedChange(sliderToMs(Number(e.target.value)))}
            className="align-middle"
          />
        </label>

        {/* Algorithm placeholder select (still static) */}
        <div className="w-px h-6 bg-neutral-800 mx-2" />
        <select className="bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-sm">
          <option>Bubble Sort</option>
          <option>Insertion Sort</option>
          <option>Stack</option>
          <option>Queue</option>
        </select>
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