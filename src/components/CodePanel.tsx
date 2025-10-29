import CodeViewer from "./CodeViewer";

const sampleTs = `type Item = number;

export function bubbleSort(arr: Item[]): Item[] {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        const tmp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = tmp;
      }
    }
  }
  return a;
}`;

export default function CodePanel() {
  return (
    <aside className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-800 text-sm opacity-80">
        Código (TypeScript) — placeholder
      </div>

      {/* Por enquanto, linguagem e código fixos só para validar o visual */}
      <CodeViewer language="typescript" code={sampleTs} />
    </aside>
  );
}