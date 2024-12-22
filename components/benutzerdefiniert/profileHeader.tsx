import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import s_changeData from "@/app/s_changeData";
import { useTheme } from "@/constants/_themeContext";

const ProfileHeader = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const getUserInitials = (displayName: string | null | undefined) => {
    if (!displayName) return "?";
    if (user?.displayName != null) {
      const nameParts = displayName.split(" "); // Trenne den Namen anhand von Leerzeichen
      const firstName = nameParts[0]; // Erster Teil: Vorname
      return firstName;
    }
  };
  const userFirstName = getUserInitials(user?.displayName);
  return (
    <View
      className={`h-52 w-full flex flex-row justify-between items-end`}
      style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      <View className="ml-6">
        <Text
          className={`text-4xl font-bold`}
          style={{ color: `${theme.textColor}` }}
        >
          Hallo {userFirstName} !
        </Text>
      </View>
      <TouchableOpacity
        className={`w-16 h-16 mr-5 rounded-full justify-center items-center`}
        style={{ backgroundColor: `${theme.backgroudnColor4}` }}
        activeOpacity={0.8}
        onPress={() => router.push("/s_changeData")}
      >
        <Text className={`font-bold`} style={{ color: `${theme.textColor}` }}>
          {userFirstName != undefined ? userFirstName[0] : "?"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
