import type { AlgorithmId } from "@types";
import type { LanguageId } from "@types";

type SnippetKey = `${string}:${string}`; // example: "bubble-sort:typescript"
type SnippetPath = string;

/** Compose "<algorithmId>:<languageId>" in a single place. */
export function snippetKey(algorithmId: AlgorithmId, languageId: LanguageId): SnippetKey {
  return `${algorithmId}:${languageId}`;
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