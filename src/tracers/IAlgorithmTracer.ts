import type { StructureType } from "@structures";
import type { StepSequence } from "@types";
import type { TracerKey } from "@keys";

/**
 * Algorithm tracer: given an initial structure, produce a deterministic trace
 * (a sequence of steps) that describes what happens at each step of execution.
 *
 * The tracer is agnostic of UI and canvas; it only emits semantic steps.
 */
export interface IAlgorithmTracer<T> {
  /** Generate the full step-by-step trace for this initial structure. */
  buildTrace(initial: T): StepSequence;

  /**
   * Stable snippet id for the code viewer (e.g., "bubble-sort:typescript").
   * It allows the UI to choose the proper source snippet to highlight.
   */
  readonly tracerId: TracerKey;

  /**
   * Structure kind consumed by a visual renderer (e.g., "array", "tree", "graph").
   * This acts as a key in the renderer registry.
   */
  readonly structure: StructureType;
}