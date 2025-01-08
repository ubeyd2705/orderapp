import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/constants/_themeContext";

export default function Rating({
  name,
  score,
  productName,
  description,
  ImageSrc,
}: {
  name: string;
  score: number;
  productName: string;
  description: string;
  ImageSrc: string | null;
}) {
  const { theme } = useTheme();

  const stars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? "star" : "star-o"} // Voller oder leerer Stern
          size={20}
          color={i <= rating ? "#FFD700" : "#D3D3D3"} // Gold für volle Sterne
          style={{ marginRight: 5 }}
        />
      );
    }
    return stars;
  };

  return (
    <View
      className="flex-row justify-between rounded-lg p-4 my-2"
      style={{
        backgroundColor: `${theme.backgroundColor}`,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      }}
    >
      <View className="flex-1 mr-3">
        <Text
          className={`text-base font-bold mb-1`}
          style={{ color: theme.textColor }}
        >
          {name}
        </Text>
        <Text
          className={`text-sm font-semibold mb-2`}
          style={{ color: theme.textColor2 }}
        >
          {productName}
        </Text>
        <View className="flex-row mb-2">{stars(score)}</View>
        <Text className="text-xs leading-5 text-gray-400">{description}</Text>
      </View>
      {ImageSrc ? (
        <Image source={{ uri: ImageSrc }} className="w-16 h-16 rounded-lg" />
      ) : null}
    </View>
  );
}
