import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
// Initialisiere den Theme Context
const ThemeContextOwn = createContext<any | undefined>(undefined);

export const useTheme = () => useContext(ThemeContextOwn);

// Erstelle den ThemeProvider
export const ThemeContextProvider = ({ children }: any) => {
  const systemColorScheme = useColorScheme(); // System-wide dark/light mode
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  // Ändere das Dark Mode global
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (systemColorScheme === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, [systemColorScheme]);

  const theme = isDarkMode
    ? {
        backgroundColor: "#1f2937",
        backgroundColor2: "#151718",
        backgroundColor3: "#334155",
        backgroudnColor4: "#374151",
        backgroundColor5: "#111827",
        textColor: "#FFFFFF",
        textColor2: "#A1A1AA",
        textColor3: "#d4d4d8",
      }
    : {
        backgroundColor: "#FFFFFF",
        backgroundColor2: "#fff",
        backgroundColor3: "#e5e7eb",
        backgroudnColor4: "#E5E7EB",
        backgroundColor5: "#B0B0B0",
        textColor: "#000000",
        textColor2: "#6B7280",
        textColor3: "#111827",
      };

  return (
    <ThemeContextOwn.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContextOwn.Provider>
  );
};
