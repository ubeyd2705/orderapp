import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import { useTheme } from "@/constants/_themeContext";
import * as Progress from "react-native-progress";
import { Ionicons } from "@expo/vector-icons";

const ProfileHeader = () => {
  const router = useRouter();
  const { user, gifts, loyaltyPoints, fetchLoyaltyPoints, fetchGifts } =
    useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      fetchLoyaltyPoints(user.uid);
    }
    if (loyaltyPoints != undefined && loyaltyPoints >= 20 && user) {
      fetchGifts(user.uid);
    }
  }, [loyaltyPoints, user]);

  const getUserInitials = (displayName: string | null | undefined) => {
    if (!displayName) return "?";
    if (user?.displayName != null) {
      const firstName = displayName[0];
      return firstName;
    }
  };
  const userFirstName = getUserInitials(user?.displayName);

  const progress = (loyaltyPoints ?? 0) / 20;
  return (
    <View
      className={`h-52 w-full flex flex-row justify-between items-end`}
      style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      <View className="ml-6 ">
        <View className="p-2  rounded-lg shadow mb-2 bg-white w-48">
          <Text className="text-lg font-bold text-gray-800">Treuepunkte</Text>
          <View className="flex flex-row  items-center ">
            <View className="flex-row items-center justify-center ">
              <Progress.Bar
                progress={progress}
                color="#0369A1"
                borderColor="#e0e0e0"
                width={75}
              />
              <Text className="ml-2 text-gray-700">20</Text>
            </View>

            <TouchableOpacity
              className="bg-sky-700 p-2 rounded-lg flex-row items-center justify-center ml-2"
              onPress={() => router.push("/redeemPoints")}
            >
              <Ionicons name="gift-outline" size={20} color="#fff" />
              <Text className="text-white">{gifts}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
