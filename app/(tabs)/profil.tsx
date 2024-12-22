import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import ProfileHeader from "@/components/benutzerdefiniert/profileHeader";
import Settings from "@/components/benutzerdefiniert/Settings";
import { useTheme } from "@/constants/_themeContext";
import Optionen from "@/components/benutzerdefiniert/Optionen";

const zahlen = () => {
  const [isLogged, setIsLogged] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
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

  return (
    <>
      {!isLogged ? (
        <View className="flex-1 justify-center items-center">
          <View
            className={`h-16 w-40 ${theme.backgroundColor3} flex items-center justify-center rounded-xl shadow shadow-slate-600`}
          >
            <TouchableOpacity
              className="h-full w-full flex items-center justify-center bg-gr "
              onPress={() => router.push("/landing")}
            >
              <Text>Melden Sie sich an</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <ProfileHeader></ProfileHeader>
          <Settings></Settings>
          <View
            className="h-14"
            style={{ backgroundColor: `${theme.backgroudnColor4}` }}
          ></View>
          <Optionen></Optionen>
        </View>
      )}
    </>
  );
};

export default zahlen;
