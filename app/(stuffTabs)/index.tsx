import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import IncomingOrders from "@/components/stuffComponents/IncomingOrders";
import { useAuth } from "@/constants/authprovider";

/**
 * Die `Index`-Komponente zeigt eingehende Bestellungen an
 * @component
 * @returns {JSX.Element} Die gerenderte Komponente für eingehende Bestellungen.
 */

const Index = () => {
  const { logout } = useAuth();

  return (
    <View className="w-full h-full">
      <View className="flex flex-row justify-between items-center mt-28 mx-4">
        <Text className="text-black font-bold md:text-4xl text-2xl">
          Eingehende Bestellungen
        </Text>
        <TouchableOpacity onPress={logout}>
          <Text>sign out</Text>
        </TouchableOpacity>
      </View>
      {/* Bereich für die Anzeige der eingehenden Bestellungen */}
      <View>
        <IncomingOrders />
      </View>
    </View>
  );
};

export default Index;
