import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/constants/authprovider";
import DeliveredOrders from "@/components/benutzerdefiniert/DeliveredOrders";

const delivered = () => {
  const { logout } = useAuth();
  return (
    <View className="w-full h-full ">
      <View className="flex flex-row justify-between items-center  mt-28 mx-4">
        <Text className="text-black font-bold md:text-4xl text-2xl ">
          servierte Bestellungen
        </Text>
        <TouchableOpacity onPress={logout}>
          <Text>sign out</Text>
        </TouchableOpacity>
      </View>
      <View>
        <DeliveredOrders></DeliveredOrders>
      </View>
    </View>
  );
};

export default delivered;
