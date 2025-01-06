import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import { getProducts } from "@/constants/_products";
import { Product } from "@/constants/types";
import { allImageSources } from "@/constants/data";

export default function ProductRatings({
  clickedRankedProduct,
}: {
  clickedRankedProduct: any;
}) {
  const [bestProducts, setbestProducts] = useState<Product[]>([]);

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

  return (
    <View className="flex-1 bg-white px-4 pt-6 ">
      {/* Titelzeile */}

      {/* Horizontales Scrollen */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row space-x-4"
      >
        {bestProducts.map((product, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => clickedRankedProduct(product.title)}
          >
            <View className="bg-gray-100 rounded-lg p-4 w-44 shadow ml-2 mt-1.5 mb-2 h-56">
              <Image
                source={allImageSources[product.imageSrc]}
                className="h-28 w-full rounded-lg mb-2"
                resizeMode="cover"
              />
              <Text className="text-sm font-bold text-gray-800">
                {product.title}
              </Text>
              {product.ratingScore != undefined ? (
                <Text className="text-sm text-gray-500">
                  {Number(product.ratingScore.toFixed(2))} ⭐
                </Text>
              ) : (
                <Text>0</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
