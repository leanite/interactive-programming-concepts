import type { IAlgorithmTracer } from "@tracers";
import type { StepSequence } from "@types";
import { Operation } from "@operations";
import { VisualStepBuilder } from "./VisualStepBuilder";
import { Structure } from "@structures";

/**
 * Tracer for Bubble Sort on numeric arrays.
 * Produces a step-by-step trace describing the algorithm flow.
 */

//TODO: BubbleSortArrayTracer na verdade é um BubbleSort de Array para Typescript! Tem que escalar pra outras linguagens
export class BubbleSortArrayTracer implements IAlgorithmTracer<number[]> {
  readonly tracerId = "bubble-sort:typescript";
  readonly structure = Structure.Array;

  buildTrace(initial: number[]): StepSequence {
    const array = [...initial];
    const stepBuilder = new VisualStepBuilder();

    const lines = {
      signature: { lineStart: 1 },
      outerLoop: { lineStart: 2 },
      innerLoop: { lineStart: 3 },
      compare: { lineStart: 4 },
      swapBlock: { lineStart: 5, lineEnd: 7 },
      returnStmt: { lineStart: 12 },
    };

    stepBuilder.add(lines.signature, "Initialize bubble sort");

    for (let i = 0; i < array.length - 1; i++) {
      stepBuilder.add(lines.outerLoop, `Outer loop i = ${i}`);
      for (let j = 0; j < array.length - i - 1; j++) {
        stepBuilder.add(
          lines.innerLoop,
          `Compare indices ${j} and ${j + 1}`,
          [{ operation: Operation.ArrayCompare, i: j, j: j + 1 }]
        );

        if (array[j] > array[j + 1]) {
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          stepBuilder.add(
            lines.swapBlock,
            `Swap ${j} and ${j + 1}`,
            [{ operation: Operation.ArraySwap, i: j, j: j + 1 }]
          );
        } else {
          stepBuilder.add(lines.compare, "No swap needed");
        }
      }
    }

    stepBuilder.add(lines.returnStmt, "Return sorted array");
    return stepBuilder.build();
  }
}