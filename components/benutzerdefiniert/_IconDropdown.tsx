import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useTheme } from "@/constants/_themeContext";

const _IconDropdown = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible((prev) => !prev);
  const getUserInitials = (displayName: string | null | undefined) => {
    if (!displayName) return "?";
    const names = displayName.split(" ");
    const initials = names[0]?.charAt(0).toUpperCase();
    return initials;
  };
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const userInitials = getUserInitials(user?.displayName);

  return (
    <>
      <TouchableOpacity onPress={toggleMenu}>
        <View
          className="w-10 h-10 rounded-full justify-center items-center"
          style={{ backgroundColor: `${theme.backgroudnColor4}` }}
        >
          <Text className="font-bold" style={{ color: `${theme.textColor}` }}>
            {userInitials}
          </Text>
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
            <Text className="text-sm p-2">Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default _IconDropdown;
