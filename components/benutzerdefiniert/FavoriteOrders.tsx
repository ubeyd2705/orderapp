import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/constants/_themeContext";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const FavoriteOrders = () => {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const router = useRouter();
  return (
    <View
      className="flex h-50 w-full p-5"
      style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      <View>
        <Text
          className={`text-2xl font-semibold`}
          style={{ color: `${theme.textColor}` }}
        >
          Menü
        </Text>
      </View>
      <TouchableOpacity
        className="mt-8 h-7 flex-row"
        onPress={() => router.push("/ListofFavoriteFoods")}
      >
        <MaterialIcons name="favorite" size={20} color="black" />
        <Text className="text-lg ml-2" style={{ color: `${theme.textColor}` }}>
          favorisierte Essen
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FavoriteOrders;
