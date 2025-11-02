import type { UniqueKey } from "@keys";
import type { Snippet } from "@snippet";


/** Minimal registry for snippet sources (plain text). */
export class SnippetRegistry {
  private readonly map = new Map<UniqueKey, Snippet>();

  register(key: UniqueKey, snippet: Snippet): void {
    this.map.set(key, snippet);
  }

  get(key: UniqueKey): Snippet {
    const snippet = this.map.get(key);
    if (!snippet) throw new Error(`Snippet not found: ${key}`);
    return snippet;
  }
}