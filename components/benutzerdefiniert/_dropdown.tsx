import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Tische } from "../../constants/data";
import { TischnummerContext } from "@/constants/context";

export default function DropdownMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState("Tisch");

  const { setTischnummer } = React.useContext(TischnummerContext);

  const toggleMenu = () => {
    setIsVisible(!isVisible);
  };
  function handleSelect(tischnummer: any) {
    setSelected(tischnummer);
    setIsVisible(!isVisible);
    setTischnummer(tischnummer);
  }

  const menuItems = [...Tische];

  return (
    <View className="flex items-center justify-center ">
      {/* Button to trigger dropdown */}
      <TouchableOpacity
        className="flex flex-row items-center px-4 py-2 bg-white rounded-lg shadow-md"
        onPress={toggleMenu}
      >
        <Text className="text-base text-gray-800 mr-2">{selected}</Text>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <Pressable
          className="absolute inset-0 bg-black/30"
          onPress={toggleMenu}
        />
        <View className="absolute top-28 right-32 w-48 bg-white rounded-lg shadow-lg">
          {menuItems.map((item) => (
            <TouchableOpacity
              className="px-4 py-3 border-b border-gray-200 last:border-b-0"
              onPress={() => handleSelect(item.Nr)}
            >
              <Text className="text-sm text-gray-700">{item.Nr}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}
