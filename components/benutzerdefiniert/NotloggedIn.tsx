import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const NotloggedIn = () => {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center">
      <View
        className={`h-16 w-40 flex items-center justify-center rounded-xl shadow shadow-slate-600`}
      >
        <TouchableOpacity
          className="h-full w-full flex items-center justify-center bg-gr "
          onPress={() => router.push("/landing")}
        >
          <Text>Melden Sie sich an</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotloggedIn;
