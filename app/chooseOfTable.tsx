import { Image, Dimensions, View } from "react-native";
import React, { useState } from "react";
import BookTable from "@/components/benutzerdefiniert/BookTable";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import Toast from "react-native-toast-message";

const chooseOfTable = () => {
  const { width, height } = Dimensions.get("window");
  const colorScheme = useColorScheme();

  return (
    <View
      className="h-full w-full  items-center "
      style={{
        backgroundColor: `${Colors[colorScheme ?? "light"].background2}`,
      }}
    >
      <Image
        source={require("./../assets/images/tableFoto.png")}
        style={{ width: width, height: height * 0.5 }}
      ></Image>
      <BookTable></BookTable>
      <Toast></Toast>
    </View>
  );
};

export default chooseOfTable;
