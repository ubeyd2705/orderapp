import { View, Text, SafeAreaView } from "react-native";

import React, { useState } from "react";
import ShowRating from "@/components/benutzerdefiniert/ShowRating";
import ProductRatings from "@/components/benutzerdefiniert/Ranking";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
const bewertung = () => {
  const [title, settitle] = useState("Burger");

  const Setthetitle = (title: string) => {
    settitle(title);
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full">
        <View className="mt-16 h-80 ">
          <Text className="ml-8 text-3xl font-semibold font">
            Unsere Besten Produkte
          </Text>
          <ProductRatings clickedRankedProduct={Setthetitle}></ProductRatings>
        </View>
        <ScrollView className="m-0">
          <ShowRating ratingOfProduct={title}></ShowRating>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default bewertung;
