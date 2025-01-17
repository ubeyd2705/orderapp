import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Dr from "../../components/benutzerdefiniert/_dropdown";
import AllProducts from "../../components/benutzerdefiniert/allProducts";
import Navigationsbar from "@/components/benutzerdefiniert/Navigationsbar";
import { useEffect, useState } from "react";
import React from "react";
import _IconDropdown from "@/components/benutzerdefiniert/_IconDropdown";
import { useTheme } from "@/constants/_themeContext";
import { useAuth } from "@/constants/authprovider";
import { Alert } from "react-native";

/**
 * Die HomeScreen-Komponente stellt die Hauptansicht für die Startseite der App dar.
 * Sie ermöglicht es dem Benutzer, eine Kategorie auszuwählen und zeigt entsprechende Produkte an.
 *
 * @returns {JSX.Element} Die Ansicht für die Startseite.
 */

export default function HomeScreen() {
  /**
   * Der Zustand für die aktuell ausgewählte Kategorie.
   * Initial auf "Essen" gesetzt.
   */
  const [activeCategory, setActiveCategory] = useState<string | null>("Essen");
  const { theme } = useTheme();
  const { user } = useAuth();

  /**
   * Funktion zum Setzen der aktiven Kategorie.
   * Wird von der Navigationsleiste aufgerufen.
   *
   * @param {string} categoryId - Die ID der ausgewählten Kategorie.
   */
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  useEffect(() => {
    if (user?.email === "gast@hotmail.com") {
      Alert.alert(
        "Achtung",
        "Um mit der App eine Bestellung zu tätigen oder einen Tisch zu buchen, müssen Sie sich anmelden"
      );
    }
  }, []);

  return (
    <SafeAreaView
      className="h-full "
      style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      <View>
        <View className="flex flex-row justify-between items-center px-4  mt-10 mx-4">
          <Text
            className="font-bold md:text-4xl text-2xl"
            style={{ color: `${theme.textColor}` }}
          >
            Menu
          </Text>
          <Dr></Dr>
          <_IconDropdown></_IconDropdown>
        </View>

        {
          <View className="flex flex-row justify-center ">
            <Navigationsbar isSelect={handleCategorySelect} />
          </View>
        }
        <View className="mb-10">
          <AllProducts categoryFilter={activeCategory}></AllProducts>
        </View>
      </View>
    </SafeAreaView>
  );
}
