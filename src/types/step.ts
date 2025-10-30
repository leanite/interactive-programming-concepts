import type { Language } from "./language";
import type { VisualOperation } from "@operations";

/**
 * A single step in the execution trace.
 * - `lineStart` / `lineEnd` define the code highlight range (1-based).
 * - `note` is an optional human-readable explanation for the step.
 * - `operations` is an optional list of visual operations to be interpreted by a renderer.
 */
export type Step = {
  lineStart: number;
  lineEnd?: number;
  note?: string;
  operations?: VisualOperation[];
};

/** Ordered list of steps. */
export type StepSequence = Step[];

export type StepFile = {
  // Versioning future-proof: allows schema evolution if needed
  version?: string; // e.g., "1"
  language: Language; // language that this step file targets
  algorithm?: string; // optional algorithm id/name, e.g., "bubble-sort"
  steps: StepSequence; // the actual list of steps
};