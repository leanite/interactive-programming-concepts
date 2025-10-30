## Engine Architecture (plug-in based)

This project uses a small, plug-in oriented engine so that **algorithms**, **languages**, and **visual renderers** can be composed without `if/else` chains.

### Core contracts

- **`IAlgorithmTracer<TInitial>`**  
  Given an initial structure, produces a `StepSequence` (each `Step` includes code line range, note, and optional visual operations).  
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