import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

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
    <View className="border-b p-4 flex flex-row justify-between">
      <View>
        {/* Profil Icon und Name */}
        <View className="flex-row items-center mb-2">
          <Text className="font-semibold text-lg">{name}</Text>
        </View>

        {/* Produktname und Bewertung */}
        <View className="mb-2">
          <Text className="text-gray-600 font-extrabold ">{productName}</Text>
          <View className="flex-row">{stars(score)}</View>
        </View>
        {/* Beschreibung der Bewertung */}
        <Text className="text-gray-800">{description}</Text>
      </View>
      <View>
        {ImageSrc != null ? (
          <Image
            source={{ uri: ImageSrc }}
            style={{ width: 50, height: 50 }}
          ></Image>
        ) : (
          <Text>Kein Bild</Text>
        )}
      </View>
    </View>
  );
}
