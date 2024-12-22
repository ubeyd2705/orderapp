import { View, Text, Switch, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";

import { useTheme } from "@/constants/_themeContext";
const Settings = () => {
  const router = useRouter();
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const { vibrationUpdater } = useAuth();

  const toggleSwitch = () => {
    setIsVibrationEnabled((previousState) => !previousState);
    if (!isVibrationEnabled) {
      vibrationUpdater(true);
    } else {
      vibrationUpdater(false);
    }
  };

  return (
    <View
      className="flex h-50 w-full p-5"
      style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      <View>
        <Text
          className={`text-2xl font-semibold`}
          style={{ color: `${theme.textColor}` }}
        >
          Settings
        </Text>
      </View>
      <View className="h-5">
        <View className="flex flex-row justify-between  items-end">
          <Text className={`text-lg `} style={{ color: `${theme.textColor}` }}>
            Vibration
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#0369A1" }}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isVibrationEnabled}
          />
        </View>
      </View>
      <View className="mt-4 h-5">
        <View className="flex flex-row justify-between  items-end">
          <Text className={`text-lg`} style={{ color: `${theme.textColor}` }}>
            Darkmodus
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#0369A1" }}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>
      </View>
      <TouchableOpacity
        className="mt-8 h-5"
        onPress={() => router.push("/s_changeData")}
      >
        <Text className="text-lg" style={{ color: `${theme.textColor}` }}>
          Daten Ändern
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
