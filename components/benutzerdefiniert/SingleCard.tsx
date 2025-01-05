import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/constants/authprovider";

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
  return (
    <View className="justify-center items-center bg-gray-100 p-5">
      <View className="bg-white rounded-lg shadow-lg p-6 w-4/5 items-center">
        <Text className="text-2xl font-bold text-gray-800 mb-2">{title}</Text>
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
