## Engine Architecture (plug-in based)

This project uses a small, plug-in oriented engine so that **algorithms**, **languages**, and **visual renderers** can be composed without `if/else` chains.

### Core contracts

- **`IAlgorithmTracer<TInitial>`**  
  Given an initial structure, `buildTrace(initial: TInitial)` produces a `StepSequence` (each `Step` includes code line range, note, and optional visual operations).  
  Also exposes:
  - `snippetId`: stable id for the code viewer (e.g., `bubble-sort:typescript`)
  - `structureKind`: renderer key (e.g., `array`, `tree`, `graph`)

- **`ILanguageAdapter`**  
  Maps semantic labels (e.g., `"outer-loop"`) to concrete code line ranges. Decouples tracers from hard-coded numbers.

- **`IVisualRenderer<TState>`**  
  Interprets domain **operations** and reduces them into a visual state `TState` that the canvas can render.

### Registries and Orchestrator

- **`TracerRegistry`**: stores tracers by `"<algorithm-id>:<language-id>"`.
- **`LanguageRegistry`**: stores language adapters by `"<language-id>"`.
- **`RendererRegistry`**: stores visual renderers by `structureKind`.

- **`Runner`**: orchestrates the flow:
  1. `buildTrace()` calls the tracer to produce steps and returns metadata (`structureKind`, `snippetId`, `languageDisplay`).
  2. `computeVisualState()` aggregates all operations up to a given step index and delegates interpretation to the proper renderer.

> UI components (player, code viewer, canvas) consume these outputs but are **not** coupled to specific algorithms or languages.

### OperationKind (centralized)

- **`OperationKind`** (`src/types/OperationKind.ts`) defines every legal operation kind.
  Current values:
  - `OperationKind.ArrayCompare` → `"array/compare"`
  - `OperationKind.ArraySwap` → `"array/swap"`

Renderers and tracers use these constants instead of hard-coded strings to ensure consistency and scalability across domains.

### Array renderer (visual)

- **`ArrayState`** (`src/types/visual.ts`): the visual state for 1D arrays consumed by the canvas (`values` + optional `focus` pair).
- **`ArrayRenderer`** (`src/renderers/ArrayRenderer.ts`): interprets `"array/compare"` and `"array/swap"` operations and reduces them into an `ArrayState`.

### Engine bootstrap

- **`src/engine/bootstrap.ts`** creates shared registries (`TracerRegistry`, `LanguageRegistry`, `RendererRegistry`), registers the `ArrayRenderer` under the `structureKind` key `"array"`, and exports a shared `Runner`.  
  Future tracers/adapters are added via `tracerRegistry.register("<algorithm-id>:<language-id>", tracer)` and `languageRegistry.register("<language-id>", adapter)` without modifying the UI or the runner.

### VisualStepBuilder (shared utility)

- **`VisualStepBuilder`** (`src/tracers/VisualStepBuilder.ts`)  
  A lightweight helper used by tracers to construct visual step sequences consistently.  
  Each call to `add(range, note, operations?)` creates a new visual step;  
  `build()` finalizes and returns the `StepSequence`.

### App wiring (trace-driven)

The UI now consumes the engine outputs:
- `runner.buildTrace(algorithmId, languageId, initialStructure)` → returns the `StepSequence` and metadata.
- `runner.computeVisualState(structureKind, initialVisual, steps, index)` → reduces all visual operations up to `index` into a visual state (`ArrayVisualState` for arrays).

The app remains UI-agnostic regarding concrete algorithms. Switching to another tracer or language is a registration concern (engine bootstrap), not a UI change.