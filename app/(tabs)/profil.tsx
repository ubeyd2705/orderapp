import { View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useNavigation } from "expo-router";
import ProfileHeader from "@/components/benutzerdefiniert/profileHeader";
import Settings from "@/components/benutzerdefiniert/Settings";
import { useTheme } from "@/constants/_themeContext";
import Optionen from "@/components/benutzerdefiniert/Optionen";
import FavoriteOrders from "@/components/benutzerdefiniert/FavoriteOrders";
import { setStatusBarStyle } from "expo-status-bar";
import NotloggedIn from "@/components/benutzerdefiniert/NotloggedIn";

const profil = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const sub = navigation.addListener("focus", (e) => {
      setStatusBarStyle("dark");
    });

    return () => {
      sub();
    };
  }, []);

  const [isLogged, setIsLogged] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (user?.email === "gast@hotmail.com") {
      setIsLogged(false);
    } else {
      setIsLogged(true);
    }
  }, [user]);

  return (
    <View
      className=" h-full w-full"
      style={{ backgroundColor: `${theme.backgroundColor3}` }}
    >
      {!isLogged ? (
        <NotloggedIn></NotloggedIn>
      ) : (
        <View className="flex-1 mb-24 ">
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

export default profil;
