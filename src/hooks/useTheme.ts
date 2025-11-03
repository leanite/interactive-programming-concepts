import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";
const STORAGE_KEY = "ipc:theme";

export function useTheme(): [ThemeMode, (next?: ThemeMode) => void] {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null);
    return saved ?? "dark";
  });

  // Apply to <html data-theme="...">
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback((next?: ThemeMode) => {
    setTheme(prev => next ?? (prev === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}