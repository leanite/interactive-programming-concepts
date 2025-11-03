import type { IAlgorithmTracer } from "@tracers";
import { type TracerKey, tracerKey } from "@keys";
import { Algorithm, type LanguageType, type StepSequence } from "@types";
import { Operation } from "@operations";
import { VisualStepBuilder } from "./VisualStepBuilder";
import { Structure } from "@structures";
import type { SnippetRange } from "@snippet";

export type SelectionSortCodeRange = SnippetRange & {
    signature: { lineStart: number; lineEnd?: number };
    outerLoop: { lineStart: number; lineEnd?: number };
    innerLoop: { lineStart: number; lineEnd?: number };
    compare: { lineStart: number; lineEnd?: number };
    swapBlock: { lineStart: number; lineEnd?: number };
    returnStmt: { lineStart: number; lineEnd?: number };
};

export class SelectionSortArrayTracer implements IAlgorithmTracer<number[]> {
    readonly algorithm = Algorithm.BubbleSort;
    readonly id: TracerKey;
    readonly structure = Structure.Array;

    constructor(language: LanguageType) {
        this.id = tracerKey(this.algorithm, language);
    }
  
    buildTrace(input: number[], snippetLanguageRange: SelectionSortCodeRange): StepSequence {
    const array = [... input];
    const stepBuilder = new VisualStepBuilder();
  
    stepBuilder.add(snippetLanguageRange.signature, "Initialize Selection Sort");
  
      for (let i = 0; i < array.length - 1; i++) {
        let min = i;
        stepBuilder.add(snippetLanguageRange.outerLoop, `Outer loop i = ${i}`);
  
        for (let j = i + 1; j < array.length; j++) {
          // compare current j with current min
          stepBuilder.add(
            snippetLanguageRange.innerLoop,
            `Scan j = ${j}, current min = ${min}`,
            [{ operation: Operation.ArrayCompare, i: j, j: min }]
          );
          if (array[j] < array[min]) {
            min = j;
            // Optional: emphasize the "min updated" branch by highlighting compare line
            stepBuilder.add(snippetLanguageRange.compare, `Update min → ${min}`);
          }
        }
  
        if (min !== i) {
          // swap a[i] and a[min]
          const tmp = array[i];
          array[i] = array[min];
          array[min] = tmp;
  
          stepBuilder.add(
            snippetLanguageRange.swapBlock,
            `Swap i = ${i} with min = ${min}`,
            [{ operation: Operation.ArraySwap, i, j: min }]
          );
        }
      }
  
      stepBuilder.add(snippetLanguageRange.returnStmt, "Return sorted array");
      return stepBuilder.build();
    }
  }