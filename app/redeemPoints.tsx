import { View, Text } from "react-native";
import React from "react";
import GiftingCards from "@/components/benutzerdefiniert/GiftingCards";
import Toast from "react-native-toast-message";

const redeemPoints = () => {
  return (
    <View className="w-full h-full">
      <GiftingCards></GiftingCards>
      <Toast />
    </View>
  );
};

export default redeemPoints;
