import type { AlgorithmType } from "@algorithms";
import type { LanguageType } from "@languages";

export type SnippetRange = {}

export class Snippet {
    readonly algorithm: AlgorithmType;
    readonly language: LanguageType;
    readonly text: string;
    readonly range: SnippetRange;

    constructor(algorithm: AlgorithmType, language: LanguageType, text: string, range: SnippetRange){
        this.algorithm = algorithm;
        this.language = language;
        this.range = range;
        this.text = text;
    }
}