import { View, Text, Switch, TouchableOpacity, Vibration } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "@/constants/_themeContext";
const Settings = () => {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const { vibrationUpdater, vibration } = useAuth();

  const toggleSwitch = () => {
    if (!vibration) {
      vibrationUpdater(true);
      Vibration.vibrate(100);
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
      <View className="h-7">
        <View className="flex flex-row justify-between  items-end">
          <View className="flex flex-row justify-center items-center">
            <MaterialIcons name="vibration" size={20} color="black" />
            <Text
              className={`ml-2 text-lg `}
              style={{ color: `${theme.textColor}` }}
            >
              Vibration
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#0369A1" }}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={vibration}
          />
        </View>
      </View>
      <View className="mt-4 h-7">
        <View className="flex flex-row justify-between  items-end">
          <View className="flex flex-row justify-center items-center">
            <MaterialCommunityIcons
              name="moon-waning-crescent"
              size={20}
              color="black"
            />

            <Text
              className={`ml-2 text-lg`}
              style={{ color: `${theme.textColor}` }}
            >
              Darkmodus
            </Text>
          </View>
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
        className="mt-6 h-7 flex items-start justify-start"
        onPress={() => router.push("/s_changeData")}
      >
        <View className="flex flex-row justify-center items-center">
          <MaterialIcons name="edit" size={20} color="black" />
          <Text
            className="text-lg ml-2"
            style={{ color: `${theme.textColor}` }}
          >
            Daten Ändern
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
