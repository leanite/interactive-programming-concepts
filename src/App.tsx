import React from "react";

export default function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Interactive Programming Concepts</h1>
      <p className="text-neutral-300">
        Tailwind configurado. Vamos começar a montar o layout nos próximos commits.
      </p>

      <div className="mt-4 rounded-xl border border-neutral-700 p-4">
        <button className="rounded-lg bg-blue-500/90 px-3 py-1.5 hover:bg-blue-500">
          Botão de teste
        </button>
      </div>
    </div>
  );
}