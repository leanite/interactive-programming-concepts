import type { Step, StepSequence } from "@types";
import type { VisualOperation } from "@operations";

/**
 * VisualStepBuilder is a reusable helper for building visual Step sequences.
 * Tracers use it to construct consistent visual traces for algorithms.
 */
export class VisualStepBuilder {
  private steps: Step[] = [];

  /**
   * Add a new visual step to the sequence.
   * @param range Code line range for highlighting (1-based).
   * @param note Human-readable explanation for this step.
   * @param operations Optional list of visual operations interpreted by renderers.
   */
  add(
    range: { lineStart: number; lineEnd?: number },
    note: string,
    operations?: VisualOperation[]
  ): this {
    this.steps.push({
      lineStart: range.lineStart,
      lineEnd: range.lineEnd,
      note,
      operations,
    });
    return this;
  }

  /** Return the ordered step sequence. */
  build(): StepSequence {
    return this.steps;
  }
}