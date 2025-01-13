import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import React, { useEffect, useState } from "react";
import ShowRating from "@/components/benutzerdefiniert/ShowRating";
import ProductRatings from "@/components/benutzerdefiniert/Ranking";
import { allImageSources } from "@/constants/data";

import { useTheme } from "@/constants/_themeContext";
import Rating from "@/components/benutzerdefiniert/Star_Rating";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { useNavigation } from "expo-router";
const bewertung = () => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [title, settitle] = useState("Burger");
  const { theme } = useTheme();
  const Setthetitle = (title: string) => {
    settitle(title);
  };

  const Produkte = [
    {
      image: "burgerFoto",
      title: "Burger",
      bewertung: 3,
      bewertungArray: ["sehr gut", "wunderschön"],
    },
    {
      image: "burgerFoto",
      title: "Burger",
      bewertung: 3,
      bewertungArray: ["sehr gut", "wunderschön"],
    },
    {
      image: "burgerFoto",
      title: "Burger",
      bewertung: 3,
      bewertungArray: ["sehr gut", "wunderschön"],
    },
  ];
  const navigation = useNavigation();
  useEffect(() => {
    const sub = navigation.addListener("focus", (e) => {
      console.log("LIGHT");
      setStatusBarStyle("light");
    });

    return () => {
      sub();
    };
  }, []);
  return (
    <View className="h-full" style={{ backgroundColor: theme.backgroundColor }}>
      <ProductRatings></ProductRatings>
    </View>
  );
};

export default bewertung;
