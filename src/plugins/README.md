# Plugin System - Developer Guide

## 📋 Overview

This directory contains all algorithm plugins for the project. Each plugin is **self-contained** and explicitly declares all its capabilities through a **manifest file**.

## 🎯 Architecture Philosophy

### Before (Manual Registration)
To add a new algorithm, you had to edit **5+ files**:
- ✏️ Create tracer in `/tracers/`
- ✏️ Edit `/tracers/index.ts`
- ✏️ Edit `/factories/tracerRegistry.factory.ts`
- ✏️ Create snippets in `/snippets/`
- ✏️ Edit `/snippets/index.ts`
- ✏️ Edit `/factories/snippetRegistry.factory.ts`
- ✏️ Edit `/types/algorithms.ts`

### Now (Manifest System) ✨
To add a new algorithm, you just:
1. **Create a folder** with the correct structure
2. **Add 1 line** to `PluginLoader.ts`

## 📁 Plugin Structure

Each plugin follows this structure:

```
src/plugins/[algorithm-name]/
├── manifest.ts          # Plugin declaration (ENTRY POINT)
├── tracer.ts           # Algorithm implementation
├── input.ts            # Input generator (optional, can reuse)
└── snippets/
    ├── typescript.txt  # Code in TypeScript
    ├── python.txt      # Code in Python (optional)
    ├── java.txt        # Code in Java (optional)
    └── ranges.ts       # Line mapping
```

## 🚀 How to Add a New Algorithm

### Step 1: Create the Structure

Copy an existing plugin as template:

```bash
cp -r src/plugins/bubble-sort src/plugins/quick-sort
```

### Step 2: Implement the Tracer

Edit `tracer.ts`:

```typescript
import type { IAlgorithmTracer } from "@tracers";
import { Algorithm, type LanguageType, type StepSequence } from "@types";
// ... imports

export class QuickSortArrayTracer implements IAlgorithmTracer<number[]> {
  readonly algorithm = Algorithm.QuickSort; // ⚠️ Remember to add to algorithms.ts
  readonly structure = Structure.Array;

  constructor(language: LanguageType) {
    this.id = tracerKey(this.algorithm, language);
  }

  buildTrace(input: number[], ranges: YourRangeType): StepSequence {
    // Your implementation here
  }
}
```

### Step 3: Create the Snippets

Add `.txt` files for each language:

**snippets/typescript.txt:**
```typescript
function quickSort(arr: number[]): number[] {
  // Your code here
}
```

**snippets/ranges.ts:**
```typescript
export const typescriptRanges = {
  signature: { lineStart: 1 },
  partition: { lineStart: 5, lineEnd: 10 },
  // ...
};
```

### Step 4: Create the Manifest

Edit `manifest.ts`:

```typescript
import { PluginManifest } from "@types";
import { Algorithm, Language } from "@types";
import { QuickSortArrayTracer } from "./tracer";
import { createArraySortInput } from "../bubble-sort/input"; // Reuse if possible

import typescriptCode from "./snippets/typescript.txt?raw";
import { typescriptRanges } from "./snippets/ranges";

const quickSortPlugin: PluginManifest = {
  algorithm: Algorithm.QuickSort,
  structure: "array",
  languages: [Language.TypeScript] as const,

  createTracer: (language) => new QuickSortArrayTracer(language),

  snippets: {
    [Language.TypeScript]: {
      code: typescriptCode,
      ranges: typescriptRanges,
    },
  },

  inputGenerator: createArraySortInput, // Can reuse from other plugins
};

export default quickSortPlugin;
```

### Step 5: Register in PluginLoader

Add **2 lines** to `src/engine/PluginLoader.ts`:

```typescript
// 1. Add the import
import quickSortPlugin from "@plugins/quick-sort/manifest";

// 2. Add to the array
const PLUGIN_MANIFESTS: PluginManifest[] = [
  bubbleSortPlugin,
  selectionSortPlugin,
  bstSearchPlugin,
  quickSortPlugin, // ← New line
];
```

### Step 6: Add to Algorithm Enum

Edit `src/types/algorithms.ts`:

```typescript
export const Algorithm = {
  BubbleSort: "bubble-sort",
  SelectionSort: "selection-sort",
  BSTSearch: "bst-search",
  QuickSort: "quick-sort", // ← New line
} as const;

// And in AlgorithmCatalog:
private static readonly algorithmNames: Record<AlgorithmType, { name: string }> = {
  // ...
  [Algorithm.QuickSort]: { name: "Quick Sort" }, // ← New line
}
```

### Step 7: Test

```bash
npm run dev
```

✅ Your algorithm should appear in the dropdown and work!

## 📝 Best Practices

### 1. **Reuse Input Generators**
If your algorithm uses the same data structure (e.g., number array), reuse the generator:

```typescript
import { createArraySortInput } from "../bubble-sort/input";

inputGenerator: createArraySortInput,
```

### 2. **Keep Ranges Synchronized**
The ranges must correspond **exactly** to the snippet lines:

```typescript
// snippets/typescript.txt (line 5)
if (arr[j] > arr[j + 1]) {

// snippets/ranges.ts
compare: { lineStart: 5 }  // ✅ Correct
```

### 3. **Use Type-Safety**
Define the specific range type for your algorithm:

```typescript
export type QuickSortCodeRange = SnippetRange & {
  partition: { lineStart: number; lineEnd?: number };
  pivotSelect: { lineStart: number; lineEnd?: number };
  // ...
};
```

### 4. **Document Visual Operations**
Be explicit about what each step does:

```typescript
stepBuilder.add(
  ranges.partition,
  "Partition array around pivot", // ← Clear description
  [{ operation: Operation.ArrayCompare, i: left, j: pivot }]
);
```

## 🔍 Available Data Structures

### Array (`structure: "array"`)
- **Operations**: `ArrayCompare`, `ArraySwap`
- **Renderer**: `ArrayRenderer`
- **Visual**: Vertical bars
- **Algorithms**: BubbleSort, SelectionSort, QuickSort, MergeSort, etc.

### BST (`structure: "bst"`)
- **Operations**: `BSTVisit`, `BSTCompare`, `BSTMoveLeft`, `BSTMoveRight`
- **Renderer**: `TreeRenderer`
- **Visual**: Binary tree
- **Algorithms**: BSTSearch, BSTInsert, BSTDelete, AVL, etc.

### Future
- `structure: "graph"` - Graphs
- `structure: "stack"` - Stacks
- `structure: "queue"` - Queues

## 🎨 About Renderers

**Important:** Renderers are **NOT** part of the plugin system!

### Why?

Renderers are registered by **data structure**, not by algorithm:

```
ArrayRenderer → used by ALL array algorithms
TreeRenderer  → used by ALL tree algorithms
GraphRenderer → used by ALL graph algorithms
```

### Implications

- ✅ You **don't need** to create a renderer when adding an algorithm
- ✅ Just specify `structure: "array"` in the manifest
- ✅ The system automatically uses the correct renderer
- ⚠️ To add a **new structure**, edit `rendererRegistry.factory.ts`

### When to create a new Renderer?

Only when you're adding a **completely new data structure**:

```typescript
// Example: Add support for Graphs
// 1. Create GraphRenderer in src/renderers/
// 2. Add Structure.Graph in src/types/structures.ts
// 3. Register in rendererRegistry.factory.ts
```

**For normal algorithms:** just use existing structures in the manifest!

## 🐛 Debugging

### Plugin doesn't appear in dropdown?
1. Check if it's in the `PLUGIN_MANIFESTS` array
2. Check if the `Algorithm` enum was updated
3. Check if `AlgorithmCatalog` has the label

### "Cannot find module" error?
- Check if the path alias `@plugins/*` is in `vite.config.ts` and `tsconfig.app.json`

### Code highlighting doesn't work?
- Check if the `ranges` correspond to the snippet lines
- Lines start at 1, not 0!

### Console errors?
Run the validation:

```typescript
import { validateAllPlugins } from "@engines";

validateAllPlugins(); // Throws error if something is wrong
```

## 📚 Reference Examples

- **Simple array**: `/plugins/bubble-sort/`
- **Array with min tracking**: `/plugins/selection-sort/`
- **BST tree**: `/plugins/bst-search/`

## 🎓 Advanced Concepts

### Multiple Languages

To support multiple languages, add more snippets:

```typescript
const plugin: PluginManifest = {
  languages: [Language.TypeScript, Language.Python, Language.Java] as const,

  snippets: {
    [Language.TypeScript]: { code: tsCode, ranges: tsRanges },
    [Language.Python]: { code: pyCode, ranges: pyRanges },
    [Language.Java]: { code: javaCode, ranges: javaRanges },
  },
};
```

### Custom Input

If you need special input:

```typescript
// input.ts
export function generateGraphInput(): GraphInput {
  // Your logic here
  return { nodes, edges };
}

// manifest.ts
inputGenerator: generateGraphInput,
```

## ❓ FAQ

**Q: Can I have algorithms with different names but same structure?**
A: Yes! Just make sure the `algorithm` enum is unique.

**Q: How do I add a new language to an existing plugin?**
A: Edit only the plugin's `manifest.ts`, adding the snippet and language.

**Q: Are plugins loaded dynamically?**
A: No, they are imported statically at build time. This guarantees type-safety and tree-shaking.

**Q: Can I have plugins in nested folders?**
A: Yes, but you need to update the import in `PluginLoader.ts`.

## 🎉 Conclusion

This architecture was designed for **scalability** and **maintainability**.

Now, adding 50 algorithms is as easy as adding 1! 🚀

---

**Questions?** Check existing plugins as reference or review the types in `src/types/plugin.ts`.
