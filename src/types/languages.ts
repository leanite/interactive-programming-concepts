// Language definitions and metadata.
// Object-oriented design: a static registry encapsulates all details.

/** Canonical language identifiers (stable, lowercase). */
export const Language = {
  Java: "java",
  Python: "python",
  C: "c",
  Rust: "rust",
  TypeScript: "typescript",
} as const;
  
/** Union type of all language ids. */
export type LanguageType = (typeof Language)[keyof typeof Language];

/**
 * LanguageCatalog: static, UI-oriented registry of supported languages.
 * Keeps default id, display names, and validation utilities.
 */
export class LanguageCatalog {
  static readonly default: LanguageType = Language.TypeScript;
  static readonly all: readonly LanguageType[] = Object.values(Language);
  private static readonly languageNames: Record<LanguageType, { name: string }> = {
    [Language.Java]: { name: "Java" },
    [Language.Python]: { name: "Python" },
    [Language.C]: { name: "C" },
    [Language.Rust]: { name: "Rust" },
    [Language.TypeScript]: { name: "TypeScript" },
  }

  static label(id: LanguageType): string {
    return LanguageCatalog.languageNames[id].name;
  }

  static isValid(value: string): value is LanguageType {
    return (this.all as string[]).includes(value);
  }
}