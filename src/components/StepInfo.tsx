type Props = {
  index: number;        // 0-based current step index
  total: number;        // total number of steps
  note?: string | null; // explanatory text for the current step
};

export default function StepInfo({ index, total, note }: Props) {
  // Compute 1-based label for display
  const label = total > 0 ? `Step ${index + 1} / ${total}` : "No steps loaded";
  const safeNote = note && note.trim().length > 0 ? note : "No note for this step.";

  return (
    <div className="theme-panel p-3" role="status" aria-live="polite">
      {/* Step counter */}
      <div className="text-sm mb-2" style={{ color: "var(--muted)" }}>
        {label}
      </div>

      {/* Step note: supports multiline text with normal wrapping */}
      <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--fg-default)" }}>
        {safeNote}
      </div>
    </div>
  );
}