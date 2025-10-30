/**
 * Language adapter maps semantic labels to code line ranges.
 * It decouples tracers from hard-coded line numbers.
 */
export interface ILanguageAdapter {
    /** Map a semantic label (e.g., "outer-loop") to a concrete line range. */
    map(label: string): { lineStart: number; lineEnd?: number };
  
    /** Pretty language name for UI (e.g., "TypeScript", "Python"). */
    readonly displayName: string;
}