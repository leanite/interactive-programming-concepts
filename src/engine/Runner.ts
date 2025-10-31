import type { AlgorithmType, LanguageType } from "@types";
import type { Step, StepSequence } from "@types";
import type { VisualOperation } from "@operations";
import type { IVisualRenderer } from "@renderers";
import type { StructureType } from "types/structures";
import { TracerRegistry, RendererRegistry } from "@registries";
import { tracerKey } from "@keys";

/**
 * Runner orchestrates tracing and visual computation via registries.
 * It does not depend on UI; it only coordinates pure components.
 */
export class Runner {
  private tracers: TracerRegistry;
  private renderers: RendererRegistry;

  constructor(tracers: TracerRegistry, renderers: RendererRegistry) {
    this.tracers = tracers;
    this.renderers = renderers;
  }

  /**
   * Produce a full trace for a given algorithm+language combo.
   * The tracer emits steps; language adapter can later refine line ranges.
   */
  buildTrace<T>(algorithm: AlgorithmType, languageId: LanguageType, initialStructure: T): {
    steps: StepSequence;
    structure: StructureType;
    snippetId: string;
  } {
    const tracer = this.tracers.get<T>(tracerKey(algorithm, languageId));

    // 1) Let the tracer build the semantic steps.
    const rawSteps = tracer.buildTrace(initialStructure);

    // 2) Optionally, a future pass could map semantic labels to precise line ranges using the adapter.
    //    At this commit, we assume steps already carry { lineStart, lineEnd }.
    const mappedSteps: StepSequence = rawSteps.map((step: Step) => step);

    return {
      steps: mappedSteps,
      structure: tracer.structure, //TODO: Not used
      snippetId: tracer.tracerId //TODO: Not used
    };
  }

  /**
   * Compute the current visual state by feeding all operations up to `index`
   * into the appropriate renderer for the structure kind.
   *
   * The caller determines the concrete TState and the initial visual state.
   */
  computeVisualState<S>(structure: StructureType, initialState: S, steps: StepSequence, index: number): S {
    const renderer: IVisualRenderer<S> = this.renderers.get<S>(structure);
    const operationsUpToIndex: VisualOperation[] = this.collectOperationsUntil(steps, index);
    return renderer.compute(initialState, operationsUpToIndex);
  }

  /** Aggregate all visual operations from step #0 to step #index (inclusive). */
  private collectOperationsUntil(steps: StepSequence, index: number): VisualOperation[] {
    const operations: VisualOperation[] = [];
    const last = Math.min(index, steps.length - 1);
    for (let stepIndex = 0; stepIndex <= last; stepIndex++) {
      const current = steps[stepIndex];
      if (current.operations && current.operations.length > 0) {
        operations.push(...current.operations);
      }
    }
    return operations;
  }
}