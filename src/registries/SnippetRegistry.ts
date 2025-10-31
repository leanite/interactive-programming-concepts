import type { AlgorithmType } from "@types";
import type { LanguageType } from "@types";
import type { SnippetKey } from "@keys";

export type SnippetPath = string;

/** Compose "<algorithmId>:<languageId>" in a single place. */
export function snippetKey(algorithm: AlgorithmType, language: LanguageType): SnippetKey {
  return `${algorithm}:${language}`;
}

/** Minimal registry for snippet sources (plain text). */
export class SnippetRegistry {
  private readonly map = new Map<SnippetKey, SnippetPath>();

  register(key: SnippetKey, source: SnippetPath): void {
    this.map.set(key, source);
  }

  get(key: SnippetKey): SnippetPath {
    const code = this.map.get(key);
    if (!code) {
      return `// Snippet not found: ${key}\n// Register it in snippet registry.`;
    }
    return code;
  }
}