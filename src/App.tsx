import { useState } from "react";
import TopBar from "./components/TopBar";
import Controls from "./components/Controls";
import Canvas from "./components/Canvas";
import CodePanel from "./components/CodePanel";

export type Language = "java" | "python" | "c" | "rust" | "typescript";

export default function App() {
  // App holds the current language state
  const [language, setLanguage] = useState<Language>("typescript");

  return (
    <div className="min-h-screen">
      <TopBar language={language} setLanguage={setLanguage} />

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4 p-4 sm:p-6">
        <section className="space-y-4">
          <Controls />
          <Canvas />
        </section>

        <CodePanel language={language} />
      </main>
    </div>
  );
}