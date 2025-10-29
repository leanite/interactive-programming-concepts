import { useCallback, useEffect, useRef, useState } from "react";

import type { Step } from "@types";

type Options = {
  steps: Step[];
  initialIndex?: number; // start at which step
  initialSpeedMs?: number; // delay between steps when playing
};

export function useStepRunner({ steps, initialIndex = 0, initialSpeedMs = 700 }: Options) {
  const [index, setIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(initialSpeedMs);
  const timerRef = useRef<number | null>(null);

  // Compute current step safely
  const current = steps[index] ?? null;

  // Advance one step if possible
  const step = useCallback(() => {
    setIndex((i) => (i < steps.length - 1 ? i + 1 : i));
  }, [steps.length]);

  // Reset to the beginning and pause
  const reset = useCallback(() => {
    setIsPlaying(false);
    setIndex(0);
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  // When playing, schedule auto-advance
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    // Stop if at the end
    if (index >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = window.setInterval(() => {
      setIndex((i) => {
        if (i < steps.length - 1) return i + 1;
        // stop at the end
        window.clearInterval(timerRef.current!);
        timerRef.current = null;
        return i;
      });
    }, speedMs) as unknown as number;

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, index, steps.length, speedMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    index,
    current,
    isPlaying,
    speedMs,
    setSpeedMs,
    step,
    reset,
    togglePlay,
    setIndex, // exposed for direct navigation if needed later
  };
}
