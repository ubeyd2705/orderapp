import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/constants/authprovider";
import { allImageSources } from "@/constants/data";
import { useTheme } from "@/constants/_themeContext";

export default function Produkt({
  orderedItemId,
  title,
  id,
  imageSrc,
  ratingScore,
  price,
  addToFavorite,
  deleteFromFavorite,
  isfavorite,
}: {
  orderedItemId: any;
  title: String;
  ratingScore: number;
  imageSrc: string;
  price: number;
  categoryId: String;
  id: number;
  addToFavorite: any;
  deleteFromFavorite: any;
  isfavorite: boolean;
}) {
  const handleFavorite = () => {
    if (!isfavorite) {
      addToFavorite();
    } else {
      deleteFromFavorite();
    }
  };
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <View
      className="flex flex-row p-4 rounded-lg shadow-lg"
      style={{
        backgroundColor: theme.backgroundColor3,
        elevation: 5, // To improve shadow on Android
        alignItems: "center", // Align items vertically
        justifyContent: "space-between", // Space between left and right sections
      }}
    >
      {/* Left section: Image and details */}
      <View className="flex flex-row" style={{ flex: 1, alignItems: "center" }}>
        {/* Image */}
        <Image
          style={{
            width: 70, // Adjusted size
            height: 70,
            borderRadius: 15,
            marginRight: 10, // Space between image and text
          }}
          source={allImageSources[imageSrc]}
          contentFit="cover"
        />

        {/* Information */}
        <View>
          {/* Title */}
          <Text
            className="text-lg font-semibold"
            style={{ color: theme.textColor }}
          >
            {title}
          </Text>

          {/* Rating */}
          <Text className="mt-2 text-sm" style={{ color: theme.textColor2 }}>
            Bewertung: {ratingScore ? Number(ratingScore.toFixed(2)) : "0"} ⭐
          </Text>

          {/* Price */}
          <Text
            className="text-xl font-semibold text-red-500 mt-2"
            style={{ color: theme.priceColor }}
          >
            {price}€
          </Text>
        </View>
      </View>

      {/* Right section: Favorite and Buy buttons */}
      <View style={{ alignItems: "center" }}>
        {/* Favorite Button */}
        {user?.email !== "gast@hotmail.com" && (
          <TouchableOpacity
            onPress={handleFavorite}
            style={{ marginBottom: 10 }}
          >
            <FontAwesome
              name={isfavorite ? "star" : "star-o"}
              size={24}
              color={isfavorite ? "#FFD700" : "#D3D3D3"}
            />
          </TouchableOpacity>
        )}

        {/* Buy Button */}
        <TouchableOpacity
          className="bg-sky-700 py-2 px-6 rounded-lg"
          onPress={() => orderedItemId(id)}
          style={{
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            elevation: 3, // For shadow effect on Android
          }}
        >
          <Text className="text-white text-lg font-medium">Kaufen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
