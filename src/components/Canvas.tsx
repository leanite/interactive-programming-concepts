import type { VisualizationState } from "../types/visual";

type Props = {
  state: VisualizationState;
};

export default function Canvas({ state }: Props) {
  const { values, focus } = state;

  // Guard: keep within bounds and avoid runtime issues
  const f1 = focus?.i1 ?? -1;
  const f2 = focus?.i2 ?? -1;

  return (
    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 h-[420px] flex items-end gap-2 overflow-hidden">
      {/* Render one bar per value; emphasize focused indices */}
      {values.map((h, i) => {
        const isFocused = i === f1 || i === f2;

        return (
          <div
            key={i}
            className={`w-6 md:w-7 lg:w-8 rounded-t ${
              isFocused ? "bg-cyan-400" : "bg-neutral-600"
            }`}
            style={{ height: `${Math.max(4, h) * 3}px` }} // scale for visibility
            title={`index=${i}, value=${h}`}
          />
        );
      })}
    </div>
  );
}