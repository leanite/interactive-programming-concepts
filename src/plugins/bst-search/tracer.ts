import type { IAlgorithmTracer } from "@tracers";
import { type TracerKey, tracerKey } from "@keys";
import { Algorithm, type LanguageType, type StepSequence } from "@types";
import { Operation } from "@operations";
import { VisualStepBuilder } from "@builders";
import { Structure } from "@structures";
import type { SnippetRange } from "@snippet";
import type { TreeNode } from "@types";


export type BSTSearchCodeRanges = SnippetRange & {
  signature: { lineStart: number; lineEnd?: number };
  loop: { lineStart: number; lineEnd?: number };
  compareEq: { lineStart: number; lineEnd?: number };
  moveLeft: { lineStart: number; lineEnd?: number };
  moveRight: { lineStart: number; lineEnd?: number };
  returnTrue: { lineStart: number; lineEnd?: number };
  returnFalse: { lineStart: number; lineEnd?: number };
};

export class BSTSearchTracer implements IAlgorithmTracer<{ root: TreeNode | null; key: number }> {
  readonly algorithm = Algorithm.BSTSearch;
  readonly id: TracerKey;
  readonly structure = Structure.BST;

  constructor(language: LanguageType) {
    this.id = tracerKey(this.algorithm, language);
  }

  buildTrace(input: { root: TreeNode | null; key: number }, snippetLanguageRange: BSTSearchCodeRanges): StepSequence {
    const { root, key } = input;
    const stepBuilder = new VisualStepBuilder();

    let curr: TreeNode | null = root;
    stepBuilder.add(snippetLanguageRange.signature, `Start BST search for ${key}`);

    while (curr) {
      stepBuilder.add(snippetLanguageRange.loop, `Visit node ${curr.value}`, [
        { operation: Operation.BSTVisit, nodeId: curr.id },
        { operation: Operation.BSTCompare, nodeId: curr.id, key },
      ]);

      if (key === curr.value) {
        stepBuilder.add(snippetLanguageRange.returnTrue, `Found ${key} at node ${curr.value}`);
        return stepBuilder.build();
      }
      if (key < curr.value) {
        const next = curr.left ?? null;
        if (next) {
          stepBuilder.add(snippetLanguageRange.moveLeft, `Move left: ${key} < ${curr.value}`, [
            { operation: Operation.BSTMoveLeft, fromId: curr.id, toId: next.id },
          ]);
        }
        curr = next;
      } else {
        const next = curr.right ?? null;
        if (next) {
          stepBuilder.add(snippetLanguageRange.moveRight, `Move right: ${key} > ${curr.value}`, [
            { operation: Operation.BSTMoveRight, fromId: curr.id, toId: next.id },
          ]);
        }
        curr = next;
      }
    }

    stepBuilder.add(snippetLanguageRange.returnFalse, `Not found: ${key}`);
    return stepBuilder.build();
  }
}
