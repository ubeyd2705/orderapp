import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const SingleCard = ({
  title,
  coupon,
  abled,
  handleClickRedeem,
}: {
  title: string;
  coupon: string;
  abled: boolean;
  handleClickRedeem: any;
}) => {
  const colorScheme = useColorScheme();
  return (
    <View
      className="justify-center items-center p-5"
      style={{
        backgroundColor: `${Colors[colorScheme ?? "light"].background2}`,
      }}
    >
      <View
        className={`bg-white rounded-lg shadow-lg ${
          colorScheme == "light" ? "shadow-gray-50" : "shadow-slate-900"
        } p-6 w-4/5 items-center`}
        style={{
          backgroundColor: `${Colors[colorScheme ?? "light"].background}`,
        }}
      >
        <Text
          className="text-2xl font-bold  mb-2"
          style={{
            color: `${Colors[colorScheme ?? "light"].text}`,
          }}
        >
          {title}
        </Text>
        <Text className="text-xl text-green-500 mb-4">{coupon}</Text>
        <TouchableOpacity
          className={`px-8 py-3 rounded-lg flex-row ${
            !abled ? "bg-gray-200" : "bg-sky-700 "
          }`}
          disabled={!abled}
          onPress={() => handleClickRedeem()}
        >
          <Text className="text-white text-lg font-semibold">
            Zum Einlösen: 1
          </Text>
          <Ionicons name="gift-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SingleCard;
