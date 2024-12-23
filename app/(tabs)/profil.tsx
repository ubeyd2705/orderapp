import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Button,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import ProfileHeader from "@/components/benutzerdefiniert/profileHeader";
import Settings from "@/components/benutzerdefiniert/Settings";
import { useTheme } from "@/constants/_themeContext";
import Optionen from "@/components/benutzerdefiniert/Optionen";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"; // Importiere FileSystem

const zahlen = () => {
  const [isLogged, setIsLogged] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [savedImageUri, setSavedImageUri] = useState<string | null>(null);
  useEffect(() => {
    if (user?.email === "gast@hotmail.com") {
      setIsLogged(false);
    } else {
      setIsLogged(true);
    }
  }, [user]);

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
          <View></View>
        </View>
      )}
    </>
  );
};

export default zahlen;
