import { View, Text, Switch } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/constants/authprovider";

const Settings = () => {
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);
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
    <View className="flex h-50 w-full p-5">
      <View>
        <Text className="text-2xl font-semibold">Settings</Text>
      </View>
      <View>
        <View className="flex flex-row justify-between  items-end">
          <Text className="text-lg">Vibration</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#0369A1" }}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isVibrationEnabled}
          />
        </View>
      </View>
    </View>
  );
};

export default Settings;
