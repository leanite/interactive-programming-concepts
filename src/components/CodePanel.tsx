export default function CodePanel() {
  return (
    <aside className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-800 text-sm opacity-80">
        Código (placeholder)
      </div>
      <div className="p-4 text-neutral-300 text-sm">
        Seção para o código com highlight por linha.
      </div>
    </aside>
  );
}