import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
} from "react-native";
import { getProducts } from "@/constants/_products";
import { Product } from "@/constants/types";
import { allImageSources } from "@/constants/data";
import { useTheme } from "@/constants/_themeContext";
import ShowRating from "./ShowRating";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
export default function ProductRatings() {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [bestProducts, setbestProducts] = useState<Product[]>([]);
  const { theme } = useTheme();
  const colorScheme = useColorScheme();

  const loadBestRatedProducts = async () => {
    const allProducts = await getProducts();
    const bestRatedpProducts = allProducts.sort(
      (prdct1, prdct2) => prdct2.ratingScore - prdct1.ratingScore
    );
    setbestProducts(bestRatedpProducts);
  };

  useEffect(() => {
    loadBestRatedProducts();
  }, []);

  const styles = StyleSheet.create({
    background: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: screenHeight * 0.5,
    },
  });

  return (
    <View className="h-full" style={{ backgroundColor: theme.backgroundColor }}>
      <FlatList
        data={bestProducts}
        horizontal={true}
        decelerationRate={0.1}
        snapToAlignment="center"
        snapToInterval={Dimensions.get("screen").width}
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={(data, index) => ({
          length: Dimensions.get("screen").width,
          offset: Dimensions.get("screen").width * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <View
            style={{
              borderRadius: 12,

              width: Dimensions.get("screen").width,
            }}
          >
            <View className="relative">
              <Image
                source={allImageSources[item.imageSrc]}
                style={{
                  width: "auto", // Dynamische Breite
                  height: screenHeight * 0.5, // 30% der Bildschirmhöhe
                  resizeMode: "cover",
                }}
              />
              {/* <View className="absolute -bottom-10 w-52 bg-red-500 h-64 z-50"></View> */}
              <LinearGradient
                // Background Linear Gradient
                colors={[
                  "transparent",
                  Colors[colorScheme ?? "light"].background,
                ]}
                locations={[0.2, 1]}
                style={styles.background}
              />
            </View>

            <View className="px-8 py-2 flex-row justify-between rounded-b-xl">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                {item.title}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-xl text-amber-400 font-semibold">
                  {Number(item.ratingScore.toFixed(2))}⭐
                </Text>
              </View>
            </View>
            <ScrollView>
              <ShowRating ratingOfProduct={item.title}></ShowRating>
            </ScrollView>
          </View>
        )}
      />
    </View>
  );
}
