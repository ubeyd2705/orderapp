import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import s_changeData from "@/app/s_changeData";

const ProfileHeader = () => {
  const router = useRouter();
  const { user } = useAuth();
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
    <View className="h-52 w-full flex flex-row justify-between items-end">
      <View className="ml-6">
        <Text className="text-4xl font-bold">Hallo {userFirstName} !</Text>
      </View>
      <TouchableOpacity
        className="w-16 h-16 mr-5 bg-gray-200 rounded-full justify-center items-center"
        activeOpacity={0.8}
        onPress={() => router.push("/s_changeData")}
      >
        <Text className="text-black font-bold">
          {userFirstName != undefined ? userFirstName[0] : "?"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
