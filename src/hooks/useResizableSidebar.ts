import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  storageKey?: string;
  min?: number; // px
  max?: number; // px
  initial?: number; // px
  enable?: boolean; // ≥ N px
};

export function useResizableSidebar({
  storageKey = "ipc:sidebarWidth",
  min = 320,
  max = 720,
  initial = 420,
  enable = true,
}: Options = {}) {
  const [width, setWidth] = useState<number>(() => {
    const saved = localStorage.getItem(storageKey);
    const parsed = saved ? parseInt(saved, 10) : initial;
    return clamp(parsed, min, max);
  });

  const draggingRef = useRef(false);

  const startDrag = useCallback((clientX: number, containerRight: number) => {
    if (!enable) return;
    draggingRef.current = true;
    
    (startDrag as any)._containerRight = containerRight;
    (startDrag as any)._startClientX = clientX;
  }, [enable]);

  const onMove = useCallback((clientX: number) => {
    if (!draggingRef.current || !enable) return;
    const containerRight = (startDrag as any)._containerRight as number;
    const newWidth = clamp(containerRight - clientX, min, max);
    setWidth(newWidth);
  }, [enable, min, max]);

  const stopDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    localStorage.setItem(storageKey, String(width));
  }, [storageKey, width]);

  useEffect(() => {
    if (!enable) return;
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const handleMouseUp = () => stopDrag();

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => stopDrag();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enable, onMove, stopDrag]);

  return {
    width,
    setWidth: (w: number) => setWidth(clamp(w, min, max)),
    startDrag,
    isEnabled: enable,
    min,
    max,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}