import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import { useTheme } from "@/constants/_themeContext";
import * as Progress from "react-native-progress";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

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
      const splitname = displayName.split(" ");
      const firstName = splitname[0];
      return firstName;
    }
  };
  const userFirstName = getUserInitials(user?.displayName);

  const progress = (loyaltyPoints ?? 0) / 20;
  return (
    <View>
      <View
        className={`h-52 w-full flex flex-row justify-between items-end`}
        style={{ backgroundColor: `${theme.backgroundColor}` }}
      >
        <View className="ml-6 ">
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
      <View className="flex-row items-center justify-center ">
        <View
          className="p-3 flex-1 "
          style={{ backgroundColor: `${theme.backgroundColor}` }}
        >
          <View className="flex-row  items-center ">
            <Progress.Bar
              progress={progress}
              color="#0369A1"
              width={305}
              height={25}
              borderRadius={15}
            />
            <Text
              className="absolute top-3 right-6 w-full h-full text-center font-extrabold"
              style={{ color: `${theme.textColor2}` }}
            >
              Du hast {loyaltyPoints} Punkte
            </Text>
            <Text className="ml-2 text-gray-700">20</Text>
            <TouchableOpacity
              className="bg-sky-700 p-2 rounded-lg flex-row items-center justify-center ml-2"
              onPress={() => router.push("/redeemPoints")}
            >
              <Ionicons name="gift-outline" size={20} color="#fff" />
              <Text className="text-white">{gifts}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
