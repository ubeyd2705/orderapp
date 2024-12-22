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
    // Hier kannst du den Dark Mode automatisch steuern, wenn das System den Dark Mode ändert
    if (systemColorScheme === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, [systemColorScheme]);

  const theme = isDarkMode
    ? {
        backgroundColor: "#1f2937",
        backgroundColor2: "bg-gray-800",
        backgroundColor3: "#334155",
        backgroudnColor4: "#374151",
        textColor: "#FFFFFF",
      }
    : {
        backgroundColor: "#FFFFFF",
        backgroundColor2: "bg-gray-100",
        backgroundColor3: "#e5e7eb",
        backgroudnColor4: "#E5E7EB",
        textColor: "#000000",
      };

  return (
    <ThemeContextOwn.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContextOwn.Provider>
  );
};
