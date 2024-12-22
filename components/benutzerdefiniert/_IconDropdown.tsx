import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/constants/authprovider";

const _IconDropdown = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible((prev) => !prev);
  const getUserInitials = (displayName: string | null | undefined) => {
    if (!displayName) return "?";
    if (user?.displayName != null) {
      console.log(user.displayName[0]);
      console.log(user.displayName[0]);
    }
    const names = displayName.split(" ");
    const initials = names[0]?.charAt(0).toUpperCase();
    return initials;
  };
  const { user, logout } = useAuth();
  const userInitials = getUserInitials(user?.displayName);
  return (
    <>
      <TouchableOpacity onPress={toggleMenu}>
        <View className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center">
          <Text className="text-black font-bold">{userInitials}</Text>
        </View>
      </TouchableOpacity>
      {menuVisible && (
        <View className="absolute top-9 right-4 bg-white shadow-md rounded-lg p-2 z-50">
          <TouchableOpacity
            onPress={() => {
              logout();
              setMenuVisible(false); // Menü schließen nach Abmeldung
            }}
          >
            <Text className="text-black text-sm p-2">Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default _IconDropdown;
