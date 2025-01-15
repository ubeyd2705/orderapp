import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Vibration,
  Platform,
  Appearance,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

import { useTheme } from "@/constants/_themeContext";
/**
 * `Settings` ist die Einstellungsseite der App, die dem Benutzer ermöglicht,
 * seine Präferenzen bezüglich des Dark Mode und der Vibration zu ändern.
 *
 * - Aktiviert oder deaktiviert Vibration.
 * - Schaltet zwischen Dark- und Light-Modus um.
 * - Ermöglicht es dem Benutzer, zu einer Seite zu navigieren, um seine Daten zu ändern.
 *
 * @returns {JSX.Element} Die Einstellungsseite.
 */
const Settings = () => {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const [colorScheme, setcolorScheme] = useState(systemColorScheme);
  const { vibrationUpdater, vibration } = useAuth();
  const [vibrationActivated, setvibrationActivated] =
    useState<boolean>(vibration);

  const platformMargin = Platform.OS === "android" ? "mt-9" : "mt-6";
  const toggleSwitch = () => {
    setvibrationActivated((prev) => !prev);
    if (!vibrationActivated) {
      vibrationUpdater(true);
      Vibration.vibrate(100);
    } else {
      vibrationUpdater(false);
    }
  };
  const handleToggleDarkmode = () => {
    const newScheme = colorScheme === "light" ? "dark" : "light";
    setcolorScheme(newScheme);
    Appearance.setColorScheme(newScheme);
    toggleDarkMode();
  };

  return (
    <View
      className="flex h-50 w-full p-5"
      style={{
        backgroundColor: theme.backgroundColor,
      }}
    >
      {/* Überschrift für die Seite */}
      <View>
        <Text
          className={`text-2xl font-semibold`}
          style={{ color: `${theme.textColor}` }}
        >
          Settings
        </Text>
      </View>
      {/* Vibrationseinstellung */}
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
            value={vibrationActivated}
          />
        </View>
      </View>
      {/* Dark Mode Einstellung */}
      <View className="mt-4 h-7 ">
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
            onValueChange={handleToggleDarkmode}
            value={isDarkMode}
          />
        </View>
      </View>
      {/* Button für das Bearbeiten von Benutzerdaten */}
      <TouchableOpacity
        className={`${platformMargin} h-7 flex items-start justify-start`}
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
