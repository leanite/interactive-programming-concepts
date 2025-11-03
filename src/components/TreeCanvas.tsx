import { useRef, useEffect, useLayoutEffect, useState } from "react";
import type { TreeNode, TreeVisualizationState } from "@types";

function useThemeVersion(): number {
  const [ver, setVer] = useState(0);

  useEffect(() => {
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

// simple layout: compute (x,y) with BFS layers
function layoutTree(root: TreeNode | null, width: number, levelHeight = 80) {
  if (!root) return [] as Array<{ id: string; value: number; x: number; y: number; left?: string; right?: string }>;
  const levels: TreeNode[][] = [];
  const queue: Array<{ node: TreeNode; depth: number }> = [{ node: root, depth: 0 }];

  let maxDepth = 0;
  while (queue.length) {
    const { node, depth } = queue.shift()!;
    maxDepth = Math.max(maxDepth, depth);
    (levels[depth] ||= []).push(node);
    if (node.left) queue.push({ node: node.left, depth: depth + 1 });
    if (node.right) queue.push({ node: node.right, depth: depth + 1 });
  }

  const nodes: Array<{ id: string; value: number; x: number; y: number; left?: string; right?: string }> = [];
  for (let d = 0; d <= maxDepth; d++) {
    const row = levels[d] ?? [];
    const count = row.length;
    for (let i = 0; i < count; i++) {
      const x = ((i + 1) / (count + 1)) * width;
      const y = 30 + d * levelHeight;
      nodes.push({ id: row[i].id, value: row[i].value, x, y, left: row[i].left?.id, right: row[i].right?.id });
    }
  }
  return nodes;
}

type Props = { state: TreeVisualizationState; width?: number; height?: number };

export default function TreeCanvas({ state, width = 640, height = 360 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeVersion = useThemeVersion();
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width: entryWidth, height: entryHeight } = entry.contentRect;

      setSize((prev) => {
        const roundedWidth = Math.round(entryWidth);
        const roundedHeight = Math.round(entryHeight);
        if (prev.width === roundedWidth && prev.height === roundedHeight) return prev;
        return { width: roundedWidth, height: roundedHeight };
      });
    });

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = size.width || canvas.clientWidth || width;
    const cssHeight = size.height || canvas.clientHeight || height;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    draw(ctx, cssWidth, cssHeight, state);
  }, [state, size, width, height, themeVersion]);

  return (
    <div className="theme-panel p-2">
      <canvas ref={canvasRef} style={{ width: "100%", height }} />
    </div>
  );
}

function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: TreeVisualizationState
) {
  ctx.clearRect(0, 0, width, height);

  const styles = getComputedStyle(document.documentElement);
  const colorNode = styles.getPropertyValue("--muted").trim() || "#6b7280";
  const colorFocus = styles.getPropertyValue("--accent").trim() || "#60a5fa";
  const colorText = styles.getPropertyValue("--fg-default").trim() || "#e5e7eb";
  const colorNodeText =
    styles.getPropertyValue("--tree-node-text").trim() ||
    styles.getPropertyValue("--fg-default").trim() ||
    "#ffffff";
  const colorEdge =
    styles.getPropertyValue("--tree-edge").trim() ||
    styles.getPropertyValue("--muted").trim() ||
    "#94a3b8";

  const nodes = layoutTree(state.root, width);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // edges
  ctx.strokeStyle = colorEdge;
  ctx.lineWidth = 1.5;
  for (const n of nodes) {
    if (n.left && byId.get(n.left)) {
      const c = byId.get(n.left)!;
      line(ctx, n.x, n.y, c.x, c.y);
    }
    if (n.right && byId.get(n.right)) {
      const c = byId.get(n.right)!;
      line(ctx, n.x, n.y, c.x, c.y);
    }
  }

  // nodes
  for (const n of nodes) {
    const isFocus = state.focusId === n.id;
    circle(ctx, n.x, n.y, 16, isFocus ? colorFocus : colorNode);
    label(ctx, String(n.value), n.x, n.y, colorNodeText);
  }

  // optional: show key
  if (typeof state.compareKey === "number") {
    ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.fillStyle = colorText;
    ctx.textAlign = "left";
    ctx.fillText(`key = ${state.compareKey}`, 8, height - 8);
  }
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1 + 16);
  ctx.lineTo(x2, y2 - 16);
  ctx.stroke();
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}
