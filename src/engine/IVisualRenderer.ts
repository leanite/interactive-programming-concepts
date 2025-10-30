import type { VisualOperation } from "@types";

/**
 * Visual renderer: interprets domain operations and produces a visual state
 * that the canvas can render. It is pure and does not touch the UI.
 */
export interface IVisualRenderer<TState> {
  /**
   * Reduce the given operations over the initial visual state to produce
   * the current visual state at a specific point in time.
   */
  compute(initial: TState, operations: VisualOperation[]): TState;

  /**
   * Optional development-time validation hook. Can be used to check whether
   * a list of operations is compatible with this renderer and its invariants.
   */
  validate?(operations: VisualOperation[]): void;
}