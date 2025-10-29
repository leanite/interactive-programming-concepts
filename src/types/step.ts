export type Step = {
    lineStart: number; // 1-based inclusive
    lineEnd?: number;  // 1-based inclusive (defaults to lineStart)
    note?: string;     // optional note for UI hints/tooltips
  };
  
export type StepSequence = Step[];