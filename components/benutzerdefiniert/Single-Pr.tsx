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
      className="p-4 rounded-lg shadow-md"
      style={{ backgroundColor: `${theme.backgroundColor3}` }}
    >
      <Image
        style={{
          flex: 1,
          width: "100%",
          height: 200,
        }}
        source={allImageSources[imageSrc]}
        contentFit="cover"
      />

      <View className="p-4">
        <Text
          className="text-lg font-bold"
          style={{ color: `${theme.textColor}` }}
        >
          {title}
        </Text>
        {ratingScore != undefined ? (
          <Text className="mt-2" style={{ color: `${theme.textColor2}` }}>
            Bewertung: {Number(ratingScore.toFixed(2))} ⭐
          </Text>
        ) : (
          <Text>0</Text>
        )}

        <View className="flex flex-row justify-between ">
          <Text className="text-xl font-semibold text-red-500 mt-4">
            {price}€
          </Text>
          {user?.email != "gast@hotmail.com" ? (
            <TouchableOpacity className="mt-4" onPress={handleFavorite}>
              <FontAwesome
                key={1}
                name={isfavorite ? "star" : "star-o"}
                size={20}
                color={isfavorite ? "#FFD700" : "#D3D3D3"}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>

      <TouchableOpacity
        className="mt-4 bg-sky-700 py-2 px-4 rounded-lg"
        onPress={() => orderedItemId(id)}
      >
        <Text className="text-white text-center font-medium">Jetzt kaufen</Text>
      </TouchableOpacity>
    </View>
  );
}
