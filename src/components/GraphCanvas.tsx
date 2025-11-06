import { useRef, useState, useLayoutEffect, useEffect } from "react";
import type { GraphVisualizationState, GraphNode } from "@types";

interface GraphCanvasProps {
  state: GraphVisualizationState;
  width?: number;
  height?: number;
}

/**
 * Visual configuration for graph rendering.
 */
const CONFIG = {
  nodeRadius: 28,
  nodeBorderWidth: 2.5,
  edgeWidth: 2,
  highlightedEdgeWidth: 3,
  fontSize: 16,
  fontWeight: "600",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  topMargin: 60,
  shadowEnabled: true,
  shadowBlur: 8,
  shadowOffsetY: 3,
  gradientEnabled: true,
  edgeOffset: 2,
} as const;

/**
 * Positioned graph node with x,y coordinates for rendering.
 */
interface PositionedNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export default function GraphCanvas({ state, width = 800, height = 600 }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [themeVersion, setThemeVersion] = useState(0);

  // Detect theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeVersion((v) => v + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Pan state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Zoom state
  const [scale, setScale] = useState(1);
  const MIN_SCALE = 0.3;
  const MAX_SCALE = 3;

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

  // Reset offset and scale when graph changes
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setScale(1);
  }, [state.graph]);

  // Mouse event handlers for panning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Wheel handler for zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom delta (negative deltaY = zoom in)
    const zoomIntensity = 0.002;
    const delta = -e.deltaY * zoomIntensity;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));

    if (newScale === scale) return; // No change

    // Zoom towards mouse position
    const scaleRatio = newScale / scale;
    const newOffsetX = mouseX - (mouseX - offset.x) * scaleRatio;
    const newOffsetY = mouseY - (mouseY - offset.y) * scaleRatio;

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

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

    drawGraphCanvas(ctx, cssWidth, cssHeight, state, offset, scale);
  }, [state, size, width, height, themeVersion, offset, scale]);

  return (
    <div className="theme-panel p-2">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      />
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
  visited: string;
  visitedDarker: string;
  visitedBorder: string;
  queued: string;
  queuedDarker: string;
  queuedBorder: string;
  focus: string;
  focusDarker: string;
  focusBorder: string;
  edge: string;
  highlightedEdge: string;
  text: string;
  nodeText: string;
  shadow: string;
}

/**
 * Get current theme colors from CSS variables.
 */
function getThemeColors(): ThemeColors {
  const styles = getComputedStyle(document.documentElement);

  const colorNode = styles.getPropertyValue("--muted").trim() || "#6b7280";
  const colorVisited = styles.getPropertyValue("--success").trim() || "#22c55e";
  let colorQueued = styles.getPropertyValue("--warning").trim() || "#eab308";
  const colorFocus = styles.getPropertyValue("--accent").trim() || "#60a5fa";
  const colorText = styles.getPropertyValue("--fg-default").trim() || "#e5e7eb";
  const colorNodeText = styles.getPropertyValue("--tree-node-text").trim() || colorText;
  const colorEdge = styles.getPropertyValue("--tree-edge").trim() || "#94a3b8";

  // Check if we're in light mode and darken the yellow
  const theme = document.documentElement.getAttribute("data-theme");
  const isLightMode = theme === "light" || (!theme && window.matchMedia("(prefers-color-scheme: light)").matches);
  if (isLightMode) {
    colorQueued = darkenColor(colorQueued, 0.15);
  }

  return {
    node: colorNode,
    nodeDarker: darkenColor(colorNode, 0.25),
    nodeBorder: lightenColor(colorNode, 0.1),
    visited: colorVisited,
    visitedDarker: darkenColor(colorVisited, 0.25),
    visitedBorder: lightenColor(colorVisited, 0.15),
    queued: colorQueued,
    queuedDarker: darkenColor(colorQueued, 0.25),
    queuedBorder: lightenColor(colorQueued, 0.15),
    focus: colorFocus,
    focusDarker: darkenColor(colorFocus, 0.25),
    focusBorder: lightenColor(colorFocus, 0.15),
    edge: colorEdge,
    highlightedEdge: colorFocus,
    text: colorText,
    nodeText: colorNodeText,
    shadow: "rgba(0, 0, 0, 0.35)",
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
 * Circular layout algorithm for graph nodes.
 * Positions nodes in a circle for clear visualization.
 */
function layoutGraph(nodes: GraphNode[], canvasWidth: number, canvasHeight: number): PositionedNode[] {
  const positioned: PositionedNode[] = [];

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Calculate radius based on canvas size and number of nodes
  const minDimension = Math.min(canvasWidth, canvasHeight);
  const radius = Math.min(minDimension * 0.35, 200);

  const angleStep = (2 * Math.PI) / nodes.length;

  for (let i = 0; i < nodes.length; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    positioned.push({
      id: nodes[i].id,
      label: nodes[i].label,
      x,
      y,
    });
  }

  return positioned;
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

  ctx.strokeStyle = isHighlighted ? colors.highlightedEdge : colors.edge;
  ctx.lineWidth = isHighlighted ? CONFIG.highlightedEdgeWidth : CONFIG.edgeWidth;
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
 * Draw a graph node as a circle with gradient and border.
 */
function drawNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isFocused: boolean,
  isVisited: boolean,
  isQueued: boolean,
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
    } else if (isVisited) {
      gradient.addColorStop(0, colors.visited);
      gradient.addColorStop(1, colors.visitedDarker);
    } else if (isQueued) {
      gradient.addColorStop(0, colors.queued);
      gradient.addColorStop(1, colors.queuedDarker);
    } else {
      gradient.addColorStop(0, colors.node);
      gradient.addColorStop(1, colors.nodeDarker);
    }
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = isFocused
      ? colors.focus
      : isVisited
      ? colors.visited
      : isQueued
      ? colors.queued
      : colors.node;
  }

  // Draw filled circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  if (CONFIG.shadowEnabled) {
    ctx.restore();
  }

  // Draw border
  ctx.strokeStyle = isFocused
    ? colors.focusBorder
    : isVisited
    ? colors.visitedBorder
    : isQueued
    ? colors.queuedBorder
    : colors.nodeBorder;
  ctx.lineWidth = CONFIG.nodeBorderWidth;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Draw node label (letter).
 */
function drawNodeLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.font = `${CONFIG.fontWeight} ${CONFIG.fontSize}px ${CONFIG.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
}

/**
 * Draw queue visualization at the bottom of canvas.
 */
function drawQueueVisualization(
  ctx: CanvasRenderingContext2D,
  queueIds: string[],
  graph: { nodes: GraphNode[] },
  canvasHeight: number,
  colors: ThemeColors
) {
  if (queueIds.length === 0) return;

  const padding = 16;
  const bottomY = canvasHeight - padding;

  // Draw "Queue:" label
  ctx.font = `600 14px ${CONFIG.fontFamily}`;
  ctx.fillStyle = colors.text;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("Queue:", padding, bottomY - 30);

  // Draw queue as array-like visualization: [ A, B, C ]
  const nodeLabels = queueIds.map((id) => {
    const node = graph.nodes.find((n) => n.id === id);
    return node?.label || id;
  });

  const queueText = `[ ${nodeLabels.join(", ")} ]`;
  ctx.font = `600 16px ${CONFIG.fontFamily}`;
  ctx.fillStyle = colors.queued;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(queueText, padding, bottomY - 8);
}

/**
 * Main drawing function for graph visualization.
 */
function drawGraphCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GraphVisualizationState,
  offset: { x: number; y: number } = { x: 0, y: 0 },
  scale: number = 1
) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  if (!state.graph || !state.graph.nodes || state.graph.nodes.length === 0) {
    return;
  }

  // Get theme colors
  const colors = getThemeColors();

  // Calculate node positions using circular layout
  const positionedNodes = layoutGraph(state.graph.nodes, width, height);
  const nodeById = new Map(positionedNodes.map((n) => [n.id, n]));

  // Build set of explored edges for highlighting
  const exploredEdgeSet = new Set<string>();
  if (state.exploredEdges) {
    for (const edge of state.exploredEdges) {
      exploredEdgeSet.add(`${edge.from}->${edge.to}`);
      exploredEdgeSet.add(`${edge.to}->${edge.from}`); // Undirected
    }
  }

  // Apply pan offset and zoom scale to all drawing operations
  ctx.save();
  ctx.translate(offset.x, offset.y);
  ctx.scale(scale, scale);

  // Draw edges first (so they appear behind nodes)
  for (const node of positionedNodes) {
    const neighbors = state.graph.edges.get(node.id) || [];
    for (const neighborId of neighbors) {
      const neighbor = nodeById.get(neighborId);
      if (neighbor) {
        // Draw each edge only once (from lower id to higher id)
        if (node.id < neighborId) {
          const isHighlighted = exploredEdgeSet.has(`${node.id}->${neighborId}`);
          drawEdge(ctx, node.x, node.y, neighbor.x, neighbor.y, isHighlighted, colors);
        }
      }
    }
  }

  // Draw nodes on top of edges
  for (const node of positionedNodes) {
    const isFocused = state.focusId === node.id;
    const isVisited = state.visitedIds?.includes(node.id) ?? false;
    const isQueued = state.queueIds?.includes(node.id) ?? false;

    drawNode(ctx, node.x, node.y, isFocused, isVisited, isQueued, colors);
    drawNodeLabel(ctx, node.label, node.x, node.y, colors.nodeText);
  }

  ctx.restore();

  // Draw queue visualization (not affected by pan/zoom)
  if (state.queueIds && state.queueIds.length > 0) {
    drawQueueVisualization(ctx, state.queueIds, state.graph, height, colors);
  }
}
