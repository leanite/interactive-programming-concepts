import { useRef, useEffect, useLayoutEffect, useState } from "react";
import type { TreeNode, TreeVisualizationState } from "@types";

/**
 * Configuration constants for tree visualization.
 * Tweak these values to customize the appearance.
 */
const CONFIG = {
  // Node appearance
  nodeRadius: 22,                  // Circle radius for each node
  nodeBorderWidth: 2.5,            // Border thickness

  // Layout spacing
  levelHeight: 90,                 // Vertical space between levels
  minHorizontalGap: 15,            // Minimum horizontal space between nodes
  topMargin: 40,                   // Space at top of canvas

  // Edge appearance
  edgeWidth: 2.5,                  // Line thickness for connections
  edgeOffset: 2,                   // Offset from node edge (for cleaner look)

  // Path visualization
  pathHighlightEnabled: true,      // Show path from root to focused node
  pathEdgeWidth: 4,                // Thickness of highlighted path edges

  // Typography
  fontSize: 14,
  fontWeight: "600",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",

  // Visual effects
  shadowEnabled: true,
  shadowBlur: 12,
  shadowOffsetY: 3,
  gradientEnabled: true,

  // Key display
  keyLabelFontSize: 13,
  keyLabelPadding: 12,
} as const;

/**
 * Positioned node for rendering (includes layout coordinates).
 */
interface PositionedNode {
  id: string;
  value: number;
  x: number;
  y: number;
  leftId?: string;
  rightId?: string;
}

/**
 * Local hook: increments a counter whenever <html data-theme="..."> changes.
 * This lets the Canvas re-render colors on theme toggle even if the state is the same.
 */
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

/**
 * TreeCanvas component that renders binary tree visualization.
 * Shows:
 * - Nodes as circles with values
 * - Edges connecting parent to children
 * - Path highlighting from root to focused node
 * - Search key display (if present)
 */
type Props = {
  state: TreeVisualizationState;
  width?: number;
  height?: number;
};

export default function TreeCanvas({ state, width = 640, height = 360 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeVersion = useThemeVersion();
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Track canvas element size for responsive rendering
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

  // Main rendering effect
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high-DPI (retina) rendering for crisp graphics
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = size.width || canvas.clientWidth || width;
    const cssHeight = size.height || canvas.clientHeight || height;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale so that all drawing uses CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawTreeCanvas(ctx, cssWidth, cssHeight, state);
  }, [state, size, width, height, themeVersion]);

  return (
    <div className="theme-panel p-2">
      <canvas ref={canvasRef} style={{ width: "100%", height }} />
    </div>
  );
}

/**
 * Theme colors extracted from CSS variables.
 */
interface ThemeColors {
  node: string;
  nodeDarker: string;
  nodeBorder: string;
  focus: string;
  focusDarker: string;
  focusBorder: string;
  edge: string;
  pathEdge: string;
  text: string;
  nodeText: string;
  shadow: string;
  keyLabel: string;
}

/**
 * Get current theme colors from CSS variables.
 */
function getThemeColors(): ThemeColors {
  const styles = getComputedStyle(document.documentElement);

  const colorNode = styles.getPropertyValue("--muted").trim() || "#6b7280";
  const colorFocus = styles.getPropertyValue("--accent").trim() || "#60a5fa";
  const colorText = styles.getPropertyValue("--fg-default").trim() || "#e5e7eb";
  const colorNodeText = styles.getPropertyValue("--tree-node-text").trim() || colorText;
  const colorEdge = styles.getPropertyValue("--tree-edge").trim() || "#94a3b8";

  return {
    node: colorNode,
    nodeDarker: darkenColor(colorNode, 0.25),
    nodeBorder: lightenColor(colorNode, 0.1),
    focus: colorFocus,
    focusDarker: darkenColor(colorFocus, 0.25),
    focusBorder: lightenColor(colorFocus, 0.15),
    edge: colorEdge,
    pathEdge: colorFocus,
    text: colorText,
    nodeText: colorNodeText,
    shadow: "rgba(0, 0, 0, 0.35)",
    keyLabel: colorText,
  };
}

/**
 * Darken a color by a given factor (0.0 - 1.0).
 */
function darkenColor(color: string, factor: number): string {
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
  return color;
}

/**
 * Lighten a color by a given factor (0.0 - 1.0).
 */
function lightenColor(color: string, factor: number): string {
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const lightenedR = Math.min(255, Math.floor(r + (255 - r) * factor));
    const lightenedG = Math.min(255, Math.floor(g + (255 - g) * factor));
    const lightenedB = Math.min(255, Math.floor(b + (255 - b) * factor));

    return `rgb(${lightenedR}, ${lightenedG}, ${lightenedB})`;
  }
  return color;
}

/**
 * Improved tree layout algorithm using recursive positioning.
 * Calculates positions that:
 * - Center parent over children
 * - Minimize horizontal space while avoiding overlaps
 * - Use available canvas width efficiently
 */
function layoutTree(root: TreeNode | null, canvasWidth: number): PositionedNode[] {
  if (!root) return [];

  // First pass: calculate subtree widths and depths
  const subtreeInfo = calculateSubtreeInfo(root);

  // Second pass: assign positions based on subtree widths
  const positions: PositionedNode[] = [];
  const totalWidth = subtreeInfo.width;
  const startX = (canvasWidth - totalWidth) / 2 + totalWidth / 2;

  assignPositions(root, startX, CONFIG.topMargin, positions);

  return positions;
}

interface SubtreeInfo {
  width: number;
  depth: number;
}

/**
 * Calculate width and depth of each subtree.
 */
function calculateSubtreeInfo(node: TreeNode | null): SubtreeInfo {
  if (!node) return { width: 0, depth: 0 };

  const leftInfo = calculateSubtreeInfo(node.left ?? null);
  const rightInfo = calculateSubtreeInfo(node.right ?? null);

  // Width is sum of children widths, or minimum node spacing if leaf
  const minWidth = CONFIG.nodeRadius * 2 + CONFIG.minHorizontalGap;
  const width = Math.max(minWidth, leftInfo.width + rightInfo.width + CONFIG.minHorizontalGap);

  const depth = 1 + Math.max(leftInfo.depth, rightInfo.depth);

  return { width, depth };
}

/**
 * Recursively assign x,y positions to nodes.
 */
function assignPositions(
  node: TreeNode,
  x: number,
  y: number,
  result: PositionedNode[]
): void {
  // Add current node
  result.push({
    id: node.id,
    value: node.value,
    x,
    y,
    leftId: node.left?.id,
    rightId: node.right?.id,
  });

  // Calculate positions for children
  if (node.left || node.right) {
    const leftInfo = calculateSubtreeInfo(node.left ?? null);
    const rightInfo = calculateSubtreeInfo(node.right ?? null);

    const childY = y + CONFIG.levelHeight;

    if (node.left) {
      // Left child: positioned to the left by half of left subtree width
      const leftX = x - rightInfo.width / 2 - CONFIG.minHorizontalGap / 2;
      assignPositions(node.left, leftX, childY, result);
    }

    if (node.right) {
      // Right child: positioned to the right by half of right subtree width
      const rightX = x + leftInfo.width / 2 + CONFIG.minHorizontalGap / 2;
      assignPositions(node.right, rightX, childY, result);
    }
  }
}

/**
 * Build a set of edges that are part of the path from root to focused node.
 */
function buildPathEdges(pathIds: string[] | undefined): Set<string> {
  const edges = new Set<string>();
  if (!pathIds || pathIds.length < 2) return edges;

  for (let i = 0; i < pathIds.length - 1; i++) {
    const from = pathIds[i];
    const to = pathIds[i + 1];
    edges.add(`${from}->${to}`);
  }

  return edges;
}

/**
 * Draw an edge (connection line) between two nodes.
 */
function drawEdge(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  isHighlighted: boolean,
  colors: ThemeColors
) {
  // Calculate angle and offset to start/end at circle edge
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);

  const offset = CONFIG.nodeRadius + CONFIG.edgeOffset;
  const startX = x1 + Math.cos(angle) * offset;
  const startY = y1 + Math.sin(angle) * offset;
  const endX = x2 - Math.cos(angle) * offset;
  const endY = y2 - Math.sin(angle) * offset;

  ctx.strokeStyle = isHighlighted ? colors.pathEdge : colors.edge;
  ctx.lineWidth = isHighlighted ? CONFIG.pathEdgeWidth : CONFIG.edgeWidth;
  ctx.lineCap = "round";

  // Draw line with subtle shadow if highlighted
  if (isHighlighted && CONFIG.shadowEnabled) {
    ctx.save();
    ctx.shadowColor = colors.shadow;
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
  }

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  if (isHighlighted && CONFIG.shadowEnabled) {
    ctx.restore();
  }
}

/**
 * Draw a tree node as a circle with gradient and border.
 */
function drawNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isFocused: boolean,
  colors: ThemeColors
) {
  const radius = CONFIG.nodeRadius;

  // Draw shadow
  if (CONFIG.shadowEnabled) {
    ctx.save();
    ctx.shadowColor = colors.shadow;
    ctx.shadowBlur = CONFIG.shadowBlur;
    ctx.shadowOffsetY = CONFIG.shadowOffsetY;
  }

  // Create radial gradient for 3D effect
  if (CONFIG.gradientEnabled) {
    const gradient = ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      radius * 0.1,
      x,
      y,
      radius
    );

    if (isFocused) {
      gradient.addColorStop(0, colors.focus);
      gradient.addColorStop(1, colors.focusDarker);
    } else {
      gradient.addColorStop(0, colors.node);
      gradient.addColorStop(1, colors.nodeDarker);
    }
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = isFocused ? colors.focus : colors.node;
  }

  // Draw filled circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  if (CONFIG.shadowEnabled) {
    ctx.restore();
  }

  // Draw border
  ctx.strokeStyle = isFocused ? colors.focusBorder : colors.nodeBorder;
  ctx.lineWidth = CONFIG.nodeBorderWidth;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Draw node value label.
 */
function drawNodeLabel(
  ctx: CanvasRenderingContext2D,
  value: number,
  x: number,
  y: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.font = `${CONFIG.fontWeight} ${CONFIG.fontSize}px ${CONFIG.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(value), x, y);
}

/**
 * Draw search key label at bottom of canvas.
 */
function drawKeyLabel(
  ctx: CanvasRenderingContext2D,
  key: number,
  canvasHeight: number,
  color: string
) {
  ctx.font = `${CONFIG.keyLabelFontSize}px ${CONFIG.fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(`Searching for: ${key}`, CONFIG.keyLabelPadding, canvasHeight - CONFIG.keyLabelPadding);
}

/**
 * Main drawing function for tree visualization.
 */
function drawTreeCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: TreeVisualizationState
) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  if (!state.root) return;

  // Get theme colors
  const colors = getThemeColors();

  // Calculate node positions
  const nodes = layoutTree(state.root, width);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  // Build path edges for highlighting
  const pathEdges = CONFIG.pathHighlightEnabled ? buildPathEdges(state.pathIds) : new Set<string>();

  // Draw edges first (so they appear behind nodes)
  for (const node of nodes) {
    if (node.leftId) {
      const child = nodeById.get(node.leftId);
      if (child) {
        const isHighlighted = pathEdges.has(`${node.id}->${child.id}`);
        drawEdge(ctx, node.x, node.y, child.x, child.y, isHighlighted, colors);
      }
    }

    if (node.rightId) {
      const child = nodeById.get(node.rightId);
      if (child) {
        const isHighlighted = pathEdges.has(`${node.id}->${child.id}`);
        drawEdge(ctx, node.x, node.y, child.x, child.y, isHighlighted, colors);
      }
    }
  }

  // Draw nodes on top of edges
  for (const node of nodes) {
    const isFocused = state.focusId === node.id;
    drawNode(ctx, node.x, node.y, isFocused, colors);
    drawNodeLabel(ctx, node.value, node.x, node.y, colors.nodeText);
  }

  // Draw search key label if present
  if (typeof state.compareKey === "number") {
    drawKeyLabel(ctx, state.compareKey, height, colors.keyLabel);
  }
}
