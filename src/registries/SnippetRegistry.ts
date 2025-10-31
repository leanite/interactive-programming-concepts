import type { SnippetKey } from "@keys";

export type SnippetPath = string;

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