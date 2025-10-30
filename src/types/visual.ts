export type Focus = {
    i1: number;      // index of the primary focused bar
    i2?: number;     // optional secondary (e.g., adjacent compare)
};

export type VisualizationState = {
    values: number[]; // heights or magnitudes to draw
    focus?: Focus;    // which indices are currently emphasized
};

// Visual state for 1D array renderers.
// The canvas reads this to draw bars and highlight focused indices.
export type ArrayVisualState = {
    /** Current array values to render as bars (heights). */
    values: number[];
    /** Optional focused indices (e.g., compare or swap pairs). */
    focus?: { i1: number; i2?: number };
};