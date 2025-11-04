import { useState } from "react";

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

/**
 * SVG Icon Components
 */
const Icons = {
  Play: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  ),
  SkipBack: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  ),
  SkipForward: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  ),
  Shuffle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  ),
  RotateCcw: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  ),
  Gauge: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
    </svg>
  ),
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
  // Map slider [0..100] to milliseconds (200..1500ms)
  const sliderValue = msToSlider(speedMs);

  return (
    <div className="theme-panel p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Utility buttons */}
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onRandomize}
            title="Randomize input"
            icon={<Icons.Shuffle />}
          />
          <IconButton
            onClick={onReset}
            title="Reset to start"
            icon={<Icons.RotateCcw />}
          />
        </div>

        {/* Center: Main playback controls */}
        <div className="flex items-center gap-1">
          <IconButton
            onClick={onBack}
            disabled={isPlaying}
            title={isPlaying ? "Pause to navigate manually" : "Previous step"}
            icon={<Icons.SkipBack />}
            size="medium"
          />

          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={onPlayPause}
          />

          <IconButton
            onClick={onStep}
            disabled={isPlaying}
            title={isPlaying ? "Pause to step manually" : "Next step"}
            icon={<Icons.SkipForward />}
            size="medium"
          />
        </div>

        {/* Right side: Speed control */}
        <div className="flex items-center gap-2.5 min-w-[180px]">
          <div
            className="flex items-center justify-center"
            style={{ color: "var(--muted)" }}
          >
            <Icons.Gauge />
          </div>
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={100}
              value={sliderValue}
              onChange={(e) => onSpeedChange(sliderToMs(Number(e.target.value)))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${sliderValue}%, var(--panel-border) ${sliderValue}%, var(--panel-border) 100%)`,
              }}
            />
          </div>
          <div
            className="text-xs font-mono tabular-nums min-w-[42px] text-right"
            style={{ color: "var(--muted)" }}
          >
            {speedMs}ms
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Play/Pause button with special styling
 */
interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

function PlayPauseButton({ isPlaying, onClick }: PlayPauseButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className="relative flex items-center justify-center transition-all duration-200"
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "var(--accent)",
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
        boxShadow: isPressed
          ? "0 2px 8px rgba(0, 0, 0, 0.15)"
          : "0 4px 12px rgba(0, 0, 0, 0.25)",
        transform: isPressed ? "scale(0.95)" : "scale(1)",
      }}
      title={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? <Icons.Pause /> : <Icons.Play />}
    </button>
  );
}

/**
 * Generic icon button component
 */
interface IconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  icon: React.ReactNode;
  size?: "small" | "medium";
}

function IconButton({
  onClick,
  disabled = false,
  title,
  icon,
  size = "small",
}: IconButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeValue = size === "medium" ? 42 : 38;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className="relative flex items-center justify-center transition-all duration-150"
      style={{
        width: sizeValue,
        height: sizeValue,
        borderRadius: "50%",
        background: disabled
          ? "var(--panel-bg)"
          : isHovered
          ? "var(--panel-bg-hover)"
          : "var(--panel-bg)",
        color: disabled ? "var(--muted)" : "var(--fg-default)",
        border: `2px solid ${disabled ? "var(--panel-border)" : isHovered ? "var(--accent)" : "var(--panel-border)"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        boxShadow: !disabled && isPressed ? "0 1px 4px rgba(0, 0, 0, 0.1)" : "none",
        transform: !disabled && isPressed ? "scale(0.92)" : "scale(1)",
      }}
    >
      {icon}
    </button>
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
