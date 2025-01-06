import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Dr from "../../components/benutzerdefiniert/_dropdown";
import { StatusBar } from "expo-status-bar";
import ConcepPr from "@/components/benutzerdefiniert/Concep-Pr";

import Navigationsbar from "@/components/benutzerdefiniert/Navigationsbar";
import { useState } from "react";
import React from "react";
import _IconDropdown from "@/components/benutzerdefiniert/_IconDropdown";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState<string | null>("Essen");

  // Funktion, um die Kategorie zu setzen
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const speisekarte = "Menü";

  return (
    <SafeAreaView className="h-full">
      <View>
        <View className="flex flex-row justify-between items-center px-4  mt-10 mx-4">
          <Text className="text-black font-bold md:text-4xl text-2xl ">
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
      <StatusBar backgroundColor="#161622" style="light"></StatusBar>
    </SafeAreaView>
  );
}
