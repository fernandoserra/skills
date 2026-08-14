import { createContext, useContext } from "react";
import { useAppTheme } from "../hooks/useAppTheme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const theme = useAppTheme();
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
