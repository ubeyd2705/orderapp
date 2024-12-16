import { View, Text, SafeAreaView } from "react-native";
import ProductRatings from "@/components/benutzerdefiniert/Ranking.tsx";
import Rating from "@/components/benutzerdefiniert/Rating.tsx";

import React from "react";
const bewertung = () => {
  const ratings = [
    {
      userName: "Ubeyd Gürcan",
      rating: 3,
      productName: "Burger",
      reviewDate: "27.05.2001",
      description: "Es schmeckt sehr gut",
    },
  ];

  return (
    <SafeAreaView className="h-full w-full">
      <View className="mt-16 h-80">
        <Text className="ml-8 text-3xl font-semibold font">
          Unsere Besten Produkte
        </Text>
        <ProductRatings></ProductRatings>
      </View>
      <View>
        <Rating
          userName={ratings[0].userName}
          rating={ratings[0].rating}
          productName={ratings[0].productName}
          reviewDate={ratings[0].reviewDate}
          description={ratings[0].description}
        ></Rating>
      </View>
    </SafeAreaView>
  );
};

export default bewertung;
