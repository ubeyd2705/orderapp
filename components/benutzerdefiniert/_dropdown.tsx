import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Tische } from "../../constants/data";
import { TischnummerContext } from "@/constants/context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function DropdownMenu() {
  const colorScheme = useColorScheme();
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
        className="flex flex-row items-center px-4 py-2 rounded-lg shadow-md"
        onPress={toggleMenu}
        style={{
          backgroundColor: `${Colors[colorScheme ?? "light"].background2}`,
        }}
      >
        <Text
          className="text-base mr-2"
          style={{
            color: `${Colors[colorScheme ?? "light"].text3}`,
          }}
        >
          {selected}
        </Text>
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
        <View
          className="absolute top-28 right-32 w-48 rounded-lg shadow-lg"
          style={{
            backgroundColor: `${Colors[colorScheme ?? "light"].background2}`,
          }}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="px-4 py-3 "
              onPress={() => handleSelect(item.Nr)}
            >
              <Text
                key={index}
                className="text-sm"
                style={{
                  color: `${Colors[colorScheme ?? "light"].text3}`,
                }}
              >
                {item.Nr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}
