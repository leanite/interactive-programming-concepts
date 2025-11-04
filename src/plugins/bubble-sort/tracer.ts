import type { IAlgorithmTracer } from "@tracers";
import { type TracerKey, tracerKey } from "@keys";
import { Algorithm, type LanguageType, type StepSequence } from "@types";
import { Operation } from "@operations";
import { VisualStepBuilder } from "@builders";
import { Structure } from "@structures";
import type { SnippetRange } from "@snippet";

/** Code range map required by this tracer (algorithm-specific shape). */
export type BubbleSortCodeRange = SnippetRange & {
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
  readonly id: TracerKey;
  readonly structure = Structure.Array;

  constructor(language: LanguageType) {
    this.id = tracerKey(this.algorithm, language);
  }

  buildTrace(input: number[], snippetLanguageRange: BubbleSortCodeRange): StepSequence {
    const array = [... input];
    const stepBuilder = new VisualStepBuilder();

    stepBuilder.add(snippetLanguageRange.signature, "Initialize bubble sort");

    for (let i = 0; i < array.length - 1; i++) {
      stepBuilder.add(snippetLanguageRange.outerLoop, `Outer loop i = ${i}`);
      for (let j = 0; j < array.length - i - 1; j++) {
        stepBuilder.add(
          snippetLanguageRange.innerLoop,
          `Compare indexes ${j} and ${j + 1}`,
          [{ operation: Operation.ArrayCompare, i: j, j: j + 1 }]
        );

        if (array[j] > array[j + 1]) {
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          stepBuilder.add(
            snippetLanguageRange.swapBlock,
            `Swap ${j} and ${j + 1}`,
            [{ operation: Operation.ArraySwap, i: j, j: j + 1 }]
          );
        } else {
          stepBuilder.add(snippetLanguageRange.compare, "No swap needed");
        }
      }
    }

    stepBuilder.add(snippetLanguageRange.returnStmt, "Return sorted array");
    return stepBuilder.build();
  }
}
