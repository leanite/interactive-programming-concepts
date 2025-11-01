import { AlgorithmCatalog, type AlgorithmType } from "@algorithms";
import { LanguageCatalog, type LanguageType } from "@languages";

type Props = {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  algorithm: AlgorithmType;
  setAlgorithm: (alg: AlgorithmType) => void;
};

export default function TopBar({ language, setLanguage, algorithm, setAlgorithm }: Props) {
  return (
    <header className="w-full border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
      {/* Algorithm selector */}
      <label className="text-sm flex items-center gap-2">
        <span className="opacity-70">Algorithm</span>
        <select
          className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
        >
          {AlgorithmCatalog.all.map((id: AlgorithmType) => (
            <option key={id} value={id}>
              {AlgorithmCatalog.label(id)}
            </option>
          ))}
        </select>
      </label>

      {/* Language selector (unchanged) */}
      <label className="text-sm flex items-center gap-2">
        <span className="opacity-70">Language</span>
        <select
          className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm"
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageType)}
        >
          {LanguageCatalog.all.map((id: LanguageType) => (
            <option key={id} value={id}>
              {LanguageCatalog.label(id)}
            </option>
          ))}
        </select>
      </label>
    </header>
  );
}