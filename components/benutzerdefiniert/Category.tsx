import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

const Category = ({
  title,
  id,
  icon,
}: //   iconUrl,
{
  title: String;
  id: String;
  icon: String;
  //   iconUrl: String;
}) => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="bg-green-500  flex flex-row ">
      <TouchableOpacity className="mt-4 bg-blue-500 py-2 px-4 rounded-lg">
        <Text className="text-white text-center font-medium">{title}</Text>
      </TouchableOpacity>
      <FontAwesome5
        name={icon}
        size={24}
        color={colorScheme == "dark" ? "white" : "dark"}
      />
    </View>
  );
};

export default Category;
