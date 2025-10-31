import type { AlgorithmType } from "@algorithms";
import type { LanguageType } from "@languages";

export type TracerKey = `${string}:${string}`; // example: "bubble-sort:typescript"
/** Compose "<algorithmId>:<languageId>" in a single place. */
export function tracerKey(algorithm: AlgorithmType, language: LanguageType): TracerKey {
    return `${algorithm}:${language}`;
}

export type SnippetKey = `${string}:${string}`; // example: "bubble-sort:typescript"
/** Compose "<algorithmId>:<languageId>" in a single place. */
export function snippetKey(algorithm: AlgorithmType, language: LanguageType): SnippetKey {
    return `${algorithm}:${language}`;
}