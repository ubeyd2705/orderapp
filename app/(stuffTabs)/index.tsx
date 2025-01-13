import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import IncomingOrders from "@/components/stuffComponents/IncomingOrders";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { logout } = useAuth();

  // Zustand zum Verfolgen des ersten Render-Zyklus
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (hasMounted) {
      if (user?.email !== "mitarbeiter@hotmail.com") {
        router.push("/landing"); // Navigiere nach dem ersten Render
      }
    } else {
      setHasMounted(true); // Setze den Zustand nach dem ersten Render
    }
  }, [user, router, hasMounted]);

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
      <View>
        <IncomingOrders />
      </View>
    </View>
  );
};

export default Index;
