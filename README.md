# 🧠 Engine Architecture (plug-in based)

This project uses a modular, plug-in oriented engine so that **algorithms**, **languages**, and **visual renderers** can be composed without `if/else` chains.

---

## Core contracts

- **`IAlgorithmTracer<TInitial>`**  
  Given an initial structure, produces a `StepSequence` (each `Step` includes code line range, note, and optional visual operations).  
  Exposes:
  - `snippetId` – stable id for the code viewer (e.g., `bubble-sort:typescript`)
  - `structureKind` – renderer key (e.g., `array`, `tree`, `graph`)

- **`ILanguageAdapter`**  
  Maps semantic labels (e.g., `"outer-loop"`) to concrete code line ranges.  
  Decouples tracers from hard-coded numbers.

- **`IVisualRenderer<TState>`**  
  Interprets domain **operations** and reduces them into a visual state `TState` that the canvas can render.

---

## Registries and Orchestrator

- **`TracerRegistry`** — stores tracers by `"<algorithm-id>:<language-id>"`.
- **`LanguageRegistry`** — stores runtime language adapters (`ILanguageAdapter`).
- **`RendererRegistry`** — stores visual renderers by structure kind.
- **`Runner`** — orchestrates the flow:
  1. `buildTrace()` → calls the tracer to produce steps and returns metadata (`structureKind`, `snippetId`, `languageDisplay`).
  2. `computeVisualState()` → aggregates all visual operations up to a given index and delegates interpretation to the correct renderer.

---

## Array renderer (visual)

- **`ArrayVisualState`** (`src/types/visual/ArrayVisualState.ts`) – describes the visual state for 1-D arrays (`values` + optional `focus` pair).
- **`ArrayRenderer`** (`src/renderers/ArrayRenderer.ts`) – interprets `"array/compare"` and `"array/swap"` operations and reduces them into an `ArrayVisualState`.

---

## Example tracer (Bubble Sort)

- **`BubbleSortArrayTracer`** (`src/tracers/BubbleSortArrayTracer.ts`)  
  Implements `IAlgorithmTracer<number[]>` for Bubble Sort.  
  Generates a deterministic `StepSequence` for a given array, with code ranges, notes, and visual operations.  
  Registered under `"bubble-sort:typescript"` in the `TracerRegistry`.

---

## Shared utilities

- **`VisualStepBuilder`** (`src/tracing/VisualStepBuilder.ts`)  
  Minimal builder used by tracers to append visual steps consistently.  
  - `add(range, note, operations?)` – pushes a new step.  
  - `build()` – returns the final sequence.

---

## Language system

Languages are handled through two independent layers:

| Layer | Location | Responsibility |
|--------|-----------|----------------|
| **UI/domain** | `src/types/language.ts` | Defines which languages exist and how they appear in the UI. |
| **Engine** | `src/engine/registry.ts` | Registers runtime adapters that map semantic labels to code lines. |

### LanguageCatalog (UI/domain layer)

- Provides static metadata for supported languages.
- Exports:
  - `Language` – canonical lowercase ids.
  - `LanguageId` – union of all ids.
  - `LanguageLabels` – readable labels.
  - `LanguageCatalog` – class exposing:
    - `.default` – default language id (`"typescript"`)
    - `.all` – ordered list of ids
    - `.label(id)` – human-friendly label
    - `.isValid(value)` – runtime validation.

Used by **TopBar** and **App** to render language selectors and maintain language state.

### LanguageRegistry (engine layer)

- Stores runtime `ILanguageAdapter` instances, each responsible for mapping semantic labels (like `"compare"`, `"swapBlock"`) to real code line ranges.
- Used internally by the **Runner** during trace generation.

**Design principle:**  
UI and engine stay fully decoupled — the catalog defines *which languages exist*, while the registry defines *how each one maps code*.

---

## App wiring (trace-driven)

The UI consumes the engine outputs:
- `runner.buildTrace(algorithmId, languageId, initialStructure)` → produces the `StepSequence` and metadata.  
- `runner.computeVisualState(structureKind, initialVisual, steps, index)` → reduces operations into the visual state (`ArrayVisualState`).

The app remains agnostic to concrete algorithms; switching algorithms or languages only requires new tracer and adapter registrations — not UI changes.

---

### Randomize control

The App exposes a **Randomize** action that:
1) resets playback,  
2) generates a new random input array, and  
3) triggers `runner.buildTrace(...)` via effect to rebuild the step sequence.

This lets users explore different instances of the same algorithm without changing the UI wiring.