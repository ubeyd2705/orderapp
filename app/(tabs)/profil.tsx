import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import ProfileHeader from "@/components/benutzerdefiniert/profileHeader";
import Settings from "@/components/benutzerdefiniert/Settings";
import { useTheme } from "@/constants/_themeContext";
import Optionen from "@/components/benutzerdefiniert/Optionen";
import FavoriteOrders from "@/components/benutzerdefiniert/FavoriteOrders";

const zahlen = () => {
  const [isLogged, setIsLogged] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (user?.email === "gast@hotmail.com") {
      setIsLogged(false);
    } else {
      setIsLogged(true);
    }
  }, [user]);

  return (
    <View
      className="  h-full w-full"
      style={{ backgroundColor: `${theme.backgroundColor3}` }}
    >
      {!isLogged ? (
        <View className="flex-1 justify-center items-center">
          <View
            className={`h-16 w-40 flex items-center justify-center rounded-xl shadow shadow-slate-600`}
          >
            <TouchableOpacity
              className="h-full w-full flex items-center justify-center bg-gr "
              onPress={() => router.push("/landing")}
            >
              <Text>Melden Sie sich an</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex-1 ">
          <ProfileHeader></ProfileHeader>
          <ScrollView>
            <Settings></Settings>
            <View
              className="h-14"
              style={{ backgroundColor: `${theme.backgroudnColor4}` }}
            ></View>
            <FavoriteOrders></FavoriteOrders>
            <View
              className="h-14"
              style={{ backgroundColor: `${theme.backgroudnColor4}` }}
            ></View>
            <Optionen></Optionen>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default zahlen;
