import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/constants/_themeContext";
import { useAuth } from "@/constants/authprovider";

const Optionen = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  return (
    <View
      className="flex h-50 w-full p-5"
      style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      <TouchableOpacity className="mt-8 h-5" onPress={logout}>
        <Text className="text-lg" style={{ color: `${theme.textColor}` }}>
          Impressum
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-8 h-5" onPress={logout}>
        <Text className="text-lg" style={{ color: `${theme.textColor}` }}>
          abmelden
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-8 h-5" onPress={logout}>
        <Text className="text-lg" style={{ color: `${theme.textColor}` }}>
          Konto Löschen
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Optionen;
