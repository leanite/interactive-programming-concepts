import type { StepSequence } from "@types";

/**
 * Algorithm tracer: given an initial structure, produce a deterministic trace
 * (a sequence of steps) that describes what happens at each step of execution.
 *
 * The tracer is agnostic of UI and canvas; it only emits semantic steps.
 */
export interface IAlgorithmTracer<TInitial> {
  /** Generate the full step-by-step trace for this initial structure. */
  buildTrace(initial: TInitial): StepSequence;

  /**
   * Stable snippet id for the code viewer (e.g., "bubble-sort:typescript").
   * It allows the UI to choose the proper source snippet to highlight.
   */
  readonly snippetId: string;

  /**
   * Structure kind consumed by a visual renderer (e.g., "array", "tree", "graph").
   * This acts as a key in the renderer registry.
   */
  readonly structureKind: string;
}