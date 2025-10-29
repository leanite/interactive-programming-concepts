export default function TopBar() {
  return (
    <header className="border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Interactive Programming Concepts</h1>

      <div className="flex items-center gap-3">
        <select
          className="bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-sm"
          defaultValue="typescript"
        >
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="rust">Rust</option>
          <option value="typescript">TypeScript</option>
        </select>

        <a
          href="#"
          className="text-sm opacity-80 hover:opacity-100 underline"
          aria-label="Repositório no GitHub"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}