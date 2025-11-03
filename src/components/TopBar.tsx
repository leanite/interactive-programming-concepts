import { AlgorithmCatalog, type AlgorithmType } from "@algorithms";
import { LanguageCatalog, type LanguageType } from "@languages";
import type { ThemeMode } from "@hooks";

type Props = {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  algorithm: AlgorithmType;
  setAlgorithm: (alg: AlgorithmType) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
};

export default function TopBar({
  language,
  setLanguage,
  algorithm,
  setAlgorithm,
  theme,
  onToggleTheme,
}: Props) {
  return (
    <header
      className="w-full px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap"
      style={{ borderBottom: "1px solid var(--panel-border)" }}
    >
      {/* Algorithm selector */}
      <label className="text-sm flex items-center gap-2">
        <span style={{ color: "var(--muted)" }}>Algorithm</span>
        <div className="select-wrapper">
          <select
            className="themed-select"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
          >
            {AlgorithmCatalog.all.map((id: AlgorithmType) => (
              <option key={id} value={id}>
                {AlgorithmCatalog.label(id)}
              </option>
            ))}
          </select>
          <svg className="select-chevron" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.42z" />
          </svg>
        </div>
      </label>

      {/* Language selector */}
      <label className="text-sm flex items-center gap-2">
        <span style={{ color: "var(--muted)" }}>Language</span>
        <div className="select-wrapper">
          <select
            className="themed-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageType)}
          >
            {LanguageCatalog.all.map((id: LanguageType) => (
              <option key={id} value={id}>
                {LanguageCatalog.label(id)}
              </option>
            ))}
          </select>
          <svg className="select-chevron" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.42z" />
          </svg>
        </div>
      </label>

      {/* Theme selector */}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          className="px-2 py-1 rounded border"
          style={{ borderColor: "var(--panel-border)", background: "var(--panel-bg)" }}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
        >
          <span className="text-xs" style={{ color: "var(--fg-default)" }}>
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </span>
        </button>
      </div>
    </header>
  );
}