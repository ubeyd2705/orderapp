import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import ProfileHeader from "@/components/benutzerdefiniert/profileHeader";

const zahlen = () => {
  const [isLogged, setIsLogged] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.email === "gast@hotmail.com") {
      setIsLogged(false);
    } else {
      setIsLogged(true);
    }
  }, [user]);

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
    <>
      {!isLogged ? (
        <View className="flex-1 justify-center items-center">
          <View className="h-16 w-40 bg-gray-300 flex items-center justify-center rounded-xl shadow shadow-slate-600">
            <TouchableOpacity
              className="h-full w-full flex items-center justify-center"
              onPress={() => router.push("/landing")}
            >
              <Text>Melden Sie sich an</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <ProfileHeader></ProfileHeader>
        </View>
      )}
    </>
  );
};

export default zahlen;
