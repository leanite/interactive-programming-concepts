import type { StructureType } from "@structures";
import type { StepSequence } from "@types";
import type { TracerKey } from "@keys";
import type { SnippetRange } from "@snippet";

/**
 * Algorithm tracer: given an initial structure, produce a deterministic trace
 * (a sequence of steps) that describes what happens at each step of execution.
 *
 * The tracer is agnostic of UI and canvas; it only emits semantic steps.
 */
export interface IAlgorithmTracer<T> {
  /** Generate the full step-by-step trace for an input structure. */
  buildTrace(input: T, snippetByLanguageRange: SnippetRange): StepSequence;
  
  /**
   * Stable tracer id for the code viewer (e.g., "bubble-sort:typescript").
   * It allows to choose the proper tracer to use a snippet to highlight.
   */
  readonly id: TracerKey;

  /**
   * Structure kind consumed by a visual renderer (e.g., "array", "tree", "graph").
   * This acts as a key in the renderer registry.
   */
  readonly structure: StructureType;
}