import { LanguageCatalog, type LanguageType } from "@languages";

type Props = {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
};

export default function TopBar({ language, setLanguage }: Props) {
  return (
    <header className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
      <h1 className="font-semibold tracking-wide">Interactive Programming Concepts</h1>

      <label className="flex items-center gap-2">
        <span className="text-sm opacity-80">Language</span>
        <select
          className="bg-neutral-800 rounded-md px-2 py-1"
          value={language}
          onChange={(e) => {
            const value = e.target.value;
            if (LanguageCatalog.isValid(value)) setLanguage(value);
          }}
        >
          {LanguageCatalog.all.map((id) => (
            <option key={id} value={id}>
              {LanguageCatalog.label(id)}
            </option>
          ))}
        </select>
      </label>
    </header>
  );
}