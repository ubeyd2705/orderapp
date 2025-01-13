import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Dr from "../../components/benutzerdefiniert/_dropdown";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import ConcepPr from "@/components/benutzerdefiniert/Concep-Pr";

import Navigationsbar from "@/components/benutzerdefiniert/Navigationsbar";
import { useEffect, useState } from "react";
import React from "react";
import _IconDropdown from "@/components/benutzerdefiniert/_IconDropdown";
import { useTheme } from "@/constants/_themeContext";
import { useNavigation } from "expo-router";
import { colorScheme } from "nativewind";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState<string | null>("Essen");
  const { theme } = useTheme();

  // Funktion, um die Kategorie zu setzen
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const speisekarte = "Menü";
  const navigation = useNavigation();
  useEffect(() => {
    const sub = navigation.addListener("focus", (e) => {
      setStatusBarStyle("dark");
    });

    return () => {
      sub();
    };
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
            {speisekarte}
          </Text>
          <Dr></Dr>
          <_IconDropdown></_IconDropdown>
        </View>

        {
          <View className="flex flex-row justify-center ">
            <Navigationsbar isSelect={handleCategorySelect} />
          </View>
        }
        <View>
          <ConcepPr categoryFilter={activeCategory}></ConcepPr>
        </View>
      </View>
    </SafeAreaView>
  );
}
