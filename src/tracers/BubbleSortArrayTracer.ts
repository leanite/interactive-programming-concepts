import type { IAlgorithmTracer } from "@tracers";
import { type TracerKey, tracerKey } from "@keys";
import { Algorithm, type LanguageType, type StepSequence } from "@types";
import { Operation } from "@operations";
import { VisualStepBuilder } from "./VisualStepBuilder";
import { Structure } from "@structures";

/** Code range map required by this tracer (algorithm-specific shape). */
export type BubbleSortCodeRanges = {
  signature: { lineStart: number; lineEnd?: number };
  outerLoop: { lineStart: number; lineEnd?: number };
  innerLoop: { lineStart: number; lineEnd?: number };
  compare: { lineStart: number; lineEnd?: number };
  swapBlock: { lineStart: number; lineEnd?: number };
  returnStmt: { lineStart: number; lineEnd?: number };
};

/**
 * Language-agnostic Bubble Sort tracer for numeric arrays.
 * Receives ids and code ranges via constructor, so the same tracer can be reused
 * for different languages/snippets by injecting a different ranges object.
 */
export class BubbleSortArrayTracer implements IAlgorithmTracer<number[]> {
  readonly algorithm = Algorithm.BubbleSort;
  readonly tracerId: TracerKey;
  readonly structure = Structure.Array;

  private readonly lines: BubbleSortCodeRanges;

  constructor(language: LanguageType, lines: BubbleSortCodeRanges) {
    this.tracerId = tracerKey(this.algorithm, language);
    this.lines = lines;
  }

  buildTrace(initial: number[]): StepSequence {
    const array = [...initial];
    const stepBuilder = new VisualStepBuilder();
    const L = this.lines;

    stepBuilder.add(L.signature, "Initialize bubble sort");

    for (let i = 0; i < array.length - 1; i++) {
      stepBuilder.add(L.outerLoop, `Outer loop i = ${i}`);
      for (let j = 0; j < array.length - i - 1; j++) {
        stepBuilder.add(
          L.innerLoop,
          `Compare indices ${j} and ${j + 1}`,
          [{ operation: Operation.ArrayCompare, i: j, j: j + 1 }]
        );

        if (array[j] > array[j + 1]) {
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          stepBuilder.add(
            L.swapBlock,
            `Swap ${j} and ${j + 1}`,
            [{ operation: Operation.ArraySwap, i: j, j: j + 1 }]
          );
        } else {
          stepBuilder.add(L.compare, "No swap needed");
        }
      }
    }

    stepBuilder.add(L.returnStmt, "Return sorted array");
    return stepBuilder.build();
  }
}