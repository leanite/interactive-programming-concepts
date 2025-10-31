import React from "react";
import type { ArrayVisualizationState } from "@types";

/**
 * Canvas component that renders 1D array as vertical bars.
 * Now shows:
 * - value labels above each bar
 * - index labels below each bar
 * It also highlights the focused indices if present in `state.focus`.
 */
type Props = {
  state: ArrayVisualizationState;
};

export default function Canvas({ state }: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high-DPI (retina) rendering for crisp text and lines.
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 640;
    const cssHeight = canvas.clientHeight || 280;

    // Allocate the backing store with DPR
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale so that all drawing can use CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawArrayCanvas(ctx, cssWidth, cssHeight, state);
  }, [state]);

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-2">
      <canvas
        ref={canvasRef}
        // These CSS sizes control the layout box; backing store is adjusted by DPR above.
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

  const maxValue = Math.max(...values);
  const barWidth = width / n - 6;
  const baseY = height - 25; // leave room for index labels

  const focus1 = state.focus?.i1;
  const focus2 = state.focus?.i2;

  for (let i = 0; i < n; i++) {
    const value = values[i];
    const barHeight = (value / maxValue) * (height - 50); // top padding for value labels
    const x = i * (barWidth + 6) + 3;
    const y = baseY - barHeight;

    // pick color based on focus
    ctx.fillStyle =
      i === focus1 || i === focus2 ? "#60a5fa" : "#6b7280";
    ctx.fillRect(x, y, barWidth, barHeight);

    // value above bar
    ctx.fillStyle = "#e5e7eb";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(String(value), x + barWidth / 2, y - 2);

    // index below bar
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(229,231,235,0.7)";
    ctx.fillText(String(i), x + barWidth / 2, baseY + 6);
  }
}