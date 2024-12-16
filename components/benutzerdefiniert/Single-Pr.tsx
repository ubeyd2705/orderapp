import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export default function Produkt({
  orderedItemId,
  title,
  id,
  imageSrc,
  ratingId,
  price,
  categoryId,
  index,
}: {
  orderedItemId: any;
  title: String;
  imageSrc: String;
  ratingId: String;
  price: number;
  categoryId: String;
  index: number;
  id: number;
}) {
  const corsFreeUrl = `https://cors-anywhere.herokuapp.com/${imageSrc}`;

  return (
    <View key={id} className="bg-white p-4 rounded-lg shadow-md">
      {/* Produkt-Bild */}
      <Image
        style={{
          flex: 1,
          width: "100%",
          height: 200,
        }}
        source={{ uri: imageSrc }}
        contentFit="cover"
      />

      {/* Produkt-Details */}
      <View className="p-4">
        {/* Titel */}
        <Text className="text-lg font-bold text-gray-800">{title}</Text>

        {/* Bewertung */}
        <Text className="text-sm text-gray-600 mt-2">
          Bewertung: {ratingId} ⭐
        </Text>

        {/* Preis */}
        <Text className="text-xl font-semibold text-red-500 mt-4">{price}</Text>
      </View>

      {/* Kaufen-Button */}
      <TouchableOpacity
        className="mt-4 bg-sky-700 py-2 px-4 rounded-lg"
        onPress={() => orderedItemId(id)}
      >
        <Text className="text-white text-center font-medium">Jetzt kaufen</Text>
      </TouchableOpacity>
    </View>
  );
}
