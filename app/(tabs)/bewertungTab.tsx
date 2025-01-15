import { View } from "react-native";

import React, { useEffect, useState } from "react";
import ProductRatings from "@/components/benutzerdefiniert/Ranking";

import { useTheme } from "@/constants/_themeContext";
import { setStatusBarStyle } from "expo-status-bar";
import { useNavigation } from "expo-router";

/**
 * Komponente für die Anzeige der Produktbewertungen.
 * Diese Komponente lädt die Produktbewertungen
 * @returns {JSX.Element} Die Ansicht für Produktbewertungen.
 */
const bewertung = () => {
  const { theme } = useTheme();

  const navigation = useNavigation();
  //Listener, um die Statusleistenfarbe anzupassen.
  useEffect(() => {
    const sub = navigation.addListener("focus", (e) => {
      setStatusBarStyle("light");
      setStatusBarStyle("dark");
    });

    return () => {
      sub();
    };
  }, []);
  return (
    <View className="h-full" style={{ backgroundColor: theme.backgroundColor }}>
      <ProductRatings></ProductRatings>
    </View>
  );
};

export default bewertung;
