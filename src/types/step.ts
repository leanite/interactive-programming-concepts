import type { Language } from "./language";

export type Step = {
  lineStart: number; // 1-based inclusive
  lineEnd?: number;  // 1-based inclusive (defaults to lineStart)
  note?: string;     // optional note for UI hints/tooltips
};
export type StepSequence = Step[];

export type StepFile = {
  // Versioning future-proof: allows schema evolution if needed
  version?: string; // e.g., "1"
  language: Language; // language that this step file targets
  algorithm?: string; // optional algorithm id/name, e.g., "bubble-sort"
  steps: StepSequence; // the actual list of steps
};