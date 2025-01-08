import { View, Text, SafeAreaView, ScrollView } from "react-native";

import React, { useState } from "react";
import ShowRating from "@/components/benutzerdefiniert/ShowRating";
import ProductRatings from "@/components/benutzerdefiniert/Ranking";

import { useTheme } from "@/constants/_themeContext";
const bewertung = () => {
  const [title, settitle] = useState("Burger");
  const { theme } = useTheme();
  const Setthetitle = (title: string) => {
    settitle(title);
  };
  return (
    <SafeAreaView
      className="h-full"
      style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      <View
        className="mt-16 h-80 mx-1 rounded-2xl"
        style={{ backgroundColor: `${theme.backgroundColor3}` }}
      >
        <Text
          className="ml-8 text-3xl font-semibold mt-3"
          style={{ color: `${theme.textColor}` }}
        >
          Unsere Besten Produkte
        </Text>
        <ProductRatings clickedRankedProduct={Setthetitle}></ProductRatings>
      </View>
      <ScrollView className="m-0">
        <ShowRating ratingOfProduct={title}></ShowRating>
      </ScrollView>
    </SafeAreaView>
  );
};

export default bewertung;
