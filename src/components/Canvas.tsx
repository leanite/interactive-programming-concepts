import React from "react";
import type { ArrayVisualizationState } from "@types";

/**
 * Configuration constants for array visualization.
 * Tweak these values to customize the appearance.
 */
const CONFIG = {
  // Bar appearance
  barWidthRatio: 0.75,        // How much of each cell the bar occupies (0.0 - 1.0)
  barBorderRadius: 4,          // Rounded corners in pixels

  // Layout spacing
  labelTopMargin: 25,          // Space above bars for value labels
  labelBottomMargin: 25,       // Space below bars for index labels

  // Typography
  fontSize: 12,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",

  // Visual effects
  shadowEnabled: true,
  shadowBlur: 8,
  shadowOffsetY: 2,
  gradientEnabled: true,
} as const;

/**
 * Local hook: increments a counter whenever <html data-theme="..."> changes.
 * This lets the Canvas re-render colors on theme toggle even if the state is the same.
 */
function useThemeVersion(): number {
  const [ver, setVer] = React.useState(0);

  React.useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          setVer((v) => v + 1);
        }
      }
    });
    observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return ver;
}

/**
 * Canvas component that renders 1D array as vertical bars.
 * Shows:
 * - value labels above each bar
 * - index labels below each bar
 * Highlights focused indices if present in `state.focus`.
 */
type Props = {
  state: ArrayVisualizationState;
};

export default function Canvas({ state }: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const themeVersion = useThemeVersion();
  const [size, setSize] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Track canvas element size so redraws happen when the sidebar resizes.
  React.useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;

      setSize((prev) => {
        const roundedWidth = Math.round(width);
        const roundedHeight = Math.round(height);
        if (prev.width === roundedWidth && prev.height === roundedHeight) return prev;
        return { width: roundedWidth, height: roundedHeight };
      });
    });

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high-DPI (retina) rendering for crisp text and lines.
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = size.width || canvas.clientWidth || 640;
    const cssHeight = size.height || canvas.clientHeight || 280;

    // Allocate the backing store with DPR
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale so that all drawing can use CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawArrayCanvas(ctx, cssWidth, cssHeight, state);
  }, [state, themeVersion, size]);

  return (
    <div className="theme-panel p-2">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 280 }}
      />
    </div>
  );
}

/**
 * Theme colors extracted from CSS variables.
 */
interface ThemeColors {
  bar: string;
  barDarker: string;
  focus: string;
  focusDarker: string;
  text: string;
  index: string;
  shadow: string;
}

/**
 * Get current theme colors from CSS variables.
 */
function getThemeColors(): ThemeColors {
  const styles = getComputedStyle(document.documentElement);

  const colorBar = styles.getPropertyValue("--muted").trim() || "#6b7280";
  const colorFocus = styles.getPropertyValue("--accent").trim() || "#60a5fa";
  const colorText = styles.getPropertyValue("--fg-default").trim() || "#e5e7eb";
  const colorIndex = styles.getPropertyValue("--muted").trim() || "rgba(229,231,235,0.7)";

  return {
    bar: colorBar,
    barDarker: darkenColor(colorBar, 0.2),
    focus: colorFocus,
    focusDarker: darkenColor(colorFocus, 0.2),
    text: colorText,
    index: colorIndex,
    shadow: "rgba(0, 0, 0, 0.3)",
  };
}

/**
 * Darken a color by a given factor (0.0 - 1.0).
 * Simple implementation that works with hex colors.
 */
function darkenColor(color: string, factor: number): string {
  // If it's a hex color
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const darkenedR = Math.floor(r * (1 - factor));
    const darkenedG = Math.floor(g * (1 - factor));
    const darkenedB = Math.floor(b * (1 - factor));

    return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
  }

  // Fallback for non-hex colors
  return color;
}

/**
 * Draw a single bar with optional gradient and shadow.
 */
function drawBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  isFocused: boolean,
  colors: ThemeColors
) {
  const radius = CONFIG.barBorderRadius;

  // Draw shadow
  if (CONFIG.shadowEnabled) {
    ctx.save();
    ctx.shadowColor = colors.shadow;
    ctx.shadowBlur = CONFIG.shadowBlur;
    ctx.shadowOffsetY = CONFIG.shadowOffsetY;
  }

  // Create gradient if enabled
  if (CONFIG.gradientEnabled) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    if (isFocused) {
      gradient.addColorStop(0, colors.focus);
      gradient.addColorStop(1, colors.focusDarker);
    } else {
      gradient.addColorStop(0, colors.bar);
      gradient.addColorStop(1, colors.barDarker);
    }
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = isFocused ? colors.focus : colors.bar;
  }

  // Draw rounded rectangle
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  if (CONFIG.shadowEnabled) {
    ctx.restore();
  }
}

/**
 * Draw value label above a bar.
 */
function drawValueLabel(
  ctx: CanvasRenderingContext2D,
  value: number,
  x: number,
  y: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.textBaseline = "bottom";
  ctx.fillText(String(value), x, y - 3);
}

/**
 * Draw index label below a bar.
 */
function drawIndexLabel(
  ctx: CanvasRenderingContext2D,
  index: number,
  x: number,
  y: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  ctx.fillText(String(index), x, y + 6);
}

/**
 * Main drawing function.
 * The coordinate system uses CSS pixels (thanks to ctx.setTransform with DPR).
 */
function drawArrayCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: ArrayVisualizationState
) {
  const values = state.values;
  const n = values.length;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  if (n === 0) return;

  // Get theme colors
  const colors = getThemeColors();

  // Setup text rendering
  ctx.font = `${CONFIG.fontSize}px ${CONFIG.fontFamily}`;
  ctx.textAlign = "center";

  // Calculate dimensions
  const maxValue = Math.max(...values);
  const cellWidth = width / n;
  const barWidth = cellWidth * CONFIG.barWidthRatio;
  const gap = (cellWidth - barWidth) / 2;
  const baseY = height - CONFIG.labelBottomMargin;
  const availableHeight = height - CONFIG.labelTopMargin - CONFIG.labelBottomMargin;

  // Get focused indices
  const focus1 = state.focus?.i1;
  const focus2 = state.focus?.i2;

  // Draw each bar with its labels
  for (let i = 0; i < n; i++) {
    const value = values[i];
    const barHeight = (value / maxValue) * availableHeight;
    const x = i * cellWidth + gap;
    const y = baseY - barHeight;
    const isFocused = (i === focus1 || i === focus2);

    // Draw bar
    drawBar(ctx, x, y, barWidth, barHeight, isFocused, colors);

    // Draw value label above bar
    drawValueLabel(ctx, value, x + barWidth / 2, y, colors.text);

    // Draw index label below bar
    drawIndexLabel(ctx, i, x + barWidth / 2, baseY, colors.index);
  }
}
