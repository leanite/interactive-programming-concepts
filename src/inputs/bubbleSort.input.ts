// Creates an integer array for Bubble Sort.
// Options allow future UI to control size and value bounds.
// - `unique: true` will try to avoid duplicates (best-effort).
export function createArraySortInput(options?: { size?: number; min?: number; max?: number; unique?: boolean; }): number[] {
    const size = Math.max(1, Math.floor(options?.size ?? 8));
    const min = Math.floor(options?.min ?? 1);
    const max = Math.floor(options?.max ?? 99);
    const unique = options?.unique ?? false;
  
    if (min > max) throw new Error("createBubbleSortInput: `min` must be <= `max`");
  
    const input: number[] = [];
    const used = new Set<number>();
  
    for (let i = 0; i < size; i++) {
        if (!unique) {
            input.push(randInt(min, max));
            continue;
        }
        // Best-effort uniqueness within [min, max]
        // Break if range exhausted to avoid infinite loops.
        const range = max - min + 1;
        if (used.size >= range) break;

        let v: number;
        let tries = 0;
        do {
            v = randInt(min, max);
            tries++;
            if (tries > range * 2) break; // safety valve
        } while (used.has(v));

        used.add(v);
        input.push(v);
    }
  
    return input;
}
  
function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}