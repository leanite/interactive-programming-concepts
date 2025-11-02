
/**
 * Stores input datas for algorithms keyed by <algorithm>.
 */

import type { AlgorithmType } from "@algorithms";

type InputGenerator<T> = (options?: any) => T;

export class InputRegistry {
    private readonly inputs = new Map<AlgorithmType, InputGenerator<unknown>>();

    registerInputGenerator<T>(algorithm: AlgorithmType, funcToGenerateData: InputGenerator<T>): void {
        this.inputs.set(algorithm, funcToGenerateData as InputGenerator<unknown>);
    }

    generateInputFor<T>(algorithm: AlgorithmType, options?: any): T {
        const funcToGenerateInput = this.inputs.get(algorithm) as InputGenerator<T>;
        if (!funcToGenerateInput) {
          throw new Error(`Input generator not found for tracer: ${algorithm}`);
        }
        return funcToGenerateInput(options);
    }
}