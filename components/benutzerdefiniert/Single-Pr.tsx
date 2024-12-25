import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/constants/authprovider";

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
  imageSrc: String;
  price: number;
  categoryId: String;
  index: number;
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

  return (
    <View key={id} className="bg-white p-4 rounded-lg shadow-md">
      <Image
        style={{
          flex: 1,
          width: "100%",
          height: 200,
        }}
        source={{ uri: imageSrc }}
        contentFit="cover"
      />

      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
        {ratingScore != undefined ? (
          <Text className="text-sm text-gray-600 mt-2">
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
