import type { Step, StepSequence } from "@types";
import type { VisualOperation } from "@operations";
import { TracerRegistry, LanguageRegistry, RendererRegistry } from "./registry";
import type { IVisualRenderer } from "./IVisualRenderer";

/**
 * Runner orchestrates tracing and visual computation via registries.
 * It does not depend on UI; it only coordinates pure components.
 */
export class Runner {
  private tracers: TracerRegistry;
  private languages: LanguageRegistry;
  private renderers: RendererRegistry;

  constructor(tracers: TracerRegistry, languages: LanguageRegistry, renderers: RendererRegistry) {
    this.tracers = tracers;
    this.languages = languages;
    this.renderers = renderers;
  }

  /**
   * Produce a full trace for a given algorithm+language combo.
   * The tracer emits steps; language adapter can later refine line ranges.
   */
  buildTrace<TInitial>(
    algorithmId: string,
    languageId: string,
    initialStructure: TInitial
  ): {
    steps: StepSequence;
    structureKind: string;
    snippetId: string;
    languageDisplay: string;
  } {
    const tracerKey = `${algorithmId}:${languageId}` as const;
    const tracer = this.tracers.get<TInitial>(tracerKey);
    const adapter = this.languages.get(languageId);

    // 1) Let the tracer build the semantic steps.
    const rawSteps = tracer.trace(initialStructure);

    // 2) Optionally, a future pass could map semantic labels to precise line ranges using the adapter.
    //    At this commit, we assume steps already carry { lineStart, lineEnd }.
    const mappedSteps: StepSequence = rawSteps.map((step: Step) => step);

    return {
      steps: mappedSteps,
      structureKind: tracer.structureKind,
      snippetId: tracer.snippetId,
      languageDisplay: adapter.displayName,
    };
  }

  /**
   * Compute the current visual state by feeding all operations up to `index`
   * into the appropriate renderer for the structure kind.
   *
   * The caller determines the concrete TState and the initial visual state.
   */
  computeVisualState<TState>(
    structureKind: string,
    initialState: TState,
    steps: StepSequence,
    index: number
  ): TState {
    const renderer: IVisualRenderer<TState> = this.renderers.get<TState>(structureKind);
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