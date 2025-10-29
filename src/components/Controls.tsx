export default function Controls() {
  return (
    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
      <div className="flex flex-wrap items-center gap-2">
        <button className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700">
          Reset
        </button>
        <button className="px-3 py-1.5 rounded-lg bg-blue-500/90 hover:bg-blue-500">
          Play
        </button>
        <button className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700">
          Step
        </button>

        <div className="w-px h-6 bg-neutral-800 mx-2" />

        <label className="text-sm opacity-80">
          Speed
          <input type="range" min={0} max={100} defaultValue={60} className="ml-2 align-middle" />
        </label>

        <div className="w-px h-6 bg-neutral-800 mx-2" />

        <select className="bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-sm">
          <option>Bubble Sort</option>
          <option>Insertion Sort</option>
          <option>Stack</option>
          <option>Queue</option>
        </select>
      </div>
    </div>
  );
}