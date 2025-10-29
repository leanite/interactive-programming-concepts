export type Focus = {
    i1: number;      // index of the primary focused bar
    i2?: number;     // optional secondary (e.g., adjacent compare)
};

export type VisualizationState = {
    values: number[]; // heights or magnitudes to draw
    focus?: Focus;    // which indices are currently emphasized
};