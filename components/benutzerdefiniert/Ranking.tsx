import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { getProducts } from "@/constants/_products";
import { Product } from "@/constants/types";
import { allImageSources } from "@/constants/data";
import { useTheme } from "@/constants/_themeContext";
import ShowRating from "./ShowRating";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
export default function ProductRatings() {
  const screenHeight = Dimensions.get("window").height;
  const [bestProducts, setbestProducts] = useState<Product[]>([]);
  const { theme } = useTheme();
  const colorScheme = useColorScheme();

  const loadBestRatedProducts = async () => {
    const allProducts = await getProducts();
    const bestRatedProducts = allProducts.sort(
      (prdct1, prdct2) => prdct2.ratingScore - prdct1.ratingScore
    );
    setbestProducts(bestRatedProducts);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rating"), () => {
      loadBestRatedProducts(); // Lade Produkte bei jeder Änderung in der Collection
    });

    return () => unsubscribe(); // Entfernt den Listener beim Unmount
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
              marginBottom: 15,

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
              <View className="w-full  absolute bottom-10 px-8 z-50 flex-row justify-between">
                <View>
                  <Text
                    className="text-5xl font-black"
                    style={{ color: `${Colors[colorScheme ?? "light"].text}` }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="text-md font-light pt-px"
                    style={{ color: `${Colors[colorScheme ?? "light"].text2}` }}
                  >
                    {item.categoryId}
                  </Text>
                </View>
                <View className="flex-row justify-center items-center gap-1">
                  <Text
                    className="text-2xl  font-semibold"
                    style={{ color: `${Colors[colorScheme ?? "light"].text}` }}
                  >
                    {Number(item.ratingScore.toFixed(2))}
                  </Text>
                  <FontAwesome
                    name="star"
                    color={Colors[colorScheme ?? "light"].text}
                    size={18}
                  ></FontAwesome>
                </View>
              </View>
              <LinearGradient
                colors={[
                  "transparent",
                  Colors[colorScheme ?? "light"].background,
                ]}
                locations={[0.45, 1]}
                style={styles.background}
              />
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
