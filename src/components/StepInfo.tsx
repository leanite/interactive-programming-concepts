type Props = {
  index: number;        // 0-based current step index
  total: number;        // total number of steps
  note?: string | null; // explanatory text for the current step
};

export default function StepInfo({ index, total, note }: Props) {
  // Compute 1-based label for display
  const label = total > 0 ? `Step ${index + 1} / ${total}` : "No steps loaded";

  return (
    <div
      className="bg-neutral-900 rounded-xl p-3 border border-neutral-800"
      role="status"
      aria-live="polite"
    >
      {/* Step counter */}
      <div className="text-sm text-neutral-300 mb-2">{label}</div>

      {/* Step note: supports multiline text with normal wrapping */}
      <div
        className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line"
      >
        {note && note.trim().length > 0
          ? note
          : "No note for this step."}
      </div>
    </div>
  );
}