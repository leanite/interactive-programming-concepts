import React from "react";
import type { ArrayVisualizationState } from "@types";

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
 * Draw the array bars plus value and index labels.
 * The coordinate system here uses CSS pixels (thanks to ctx.setTransform with DPR).
 */
function drawArrayCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: ArrayVisualizationState
) {
  const values = state.values;
  const n = values.length;
  ctx.clearRect(0, 0, width, height);
  if (n === 0) return;

  // Resolve theme colors from <html data-theme="...">
  const styles = getComputedStyle(document.documentElement);
  const colorBar   = (styles.getPropertyValue("--muted").trim() || "#6b7280");
  const colorFocus = (styles.getPropertyValue("--accent").trim() || "#60a5fa");
  const colorText  = (styles.getPropertyValue("--fg-default").trim() || "#e5e7eb");
  const colorIndex = (styles.getPropertyValue("--muted").trim() || "rgba(229,231,235,0.7)");

  const maxValue = Math.max(...values);
  const cellWidth = width / n;
  const barWidth = cellWidth * 0.4; // thinner bars
  const gap = (cellWidth - barWidth) / 2;
  const baseY = height - 25; // room for index labels

  const focus1 = state.focus?.i1;
  const focus2 = state.focus?.i2;

  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textAlign = "center";

  for (let i = 0; i < n; i++) {
    const value = values[i];
    const barHeight = (value / maxValue) * (height - 50); // room for value labels
    const x = i * cellWidth + gap;
    const y = baseY - barHeight;

    // bar
    ctx.fillStyle = (i === focus1 || i === focus2) ? colorFocus : colorBar;
    ctx.fillRect(x, y, barWidth, barHeight);

    // value above bar
    ctx.fillStyle = colorText;
    ctx.textBaseline = "bottom";
    ctx.fillText(String(value), x + barWidth / 2, y - 3);

    // index below bar
    ctx.textBaseline = "top";
    ctx.fillStyle = colorIndex;
    ctx.fillText(String(i), x + barWidth / 2, baseY + 6);
  }
}
