import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useTheme } from "@/constants/_themeContext";
import { useAuth } from "@/constants/authprovider";
import { auth } from "@/firebase/firebase";
import { deleteUser } from "firebase/auth";
import { useRouter } from "expo-router";

const Optionen = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const deleteAccount = async () => {
    try {
      await deleteUser(auth.currentUser);
      Alert.alert("Konto gelöscht", "Ihr Konto wurde erfolgreich gelöscht.");
    } catch (error) {
      // Hier könnte ein Re-Authentifizierungsprozess gestartet werden.
      console.error("Fehler beim Löschen des Kontos:", error);
      Alert.alert("Fehler", "Es gab ein Problem beim Löschen des Kontos.");
    }
  };
  return (
    <View
      className="flex h-50 w-full p-5 bg-red-600"
      // style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      <TouchableOpacity
        className="mt-8 h-7"
        onPress={() => router.push("/impressum")}
      >
        <Text className="text-lg" style={{ color: `${theme.textColor}` }}>
          Impressum
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-8 h-7" onPress={logout}>
        <Text className="text-lg" style={{ color: `${theme.textColor}` }}>
          abmelden
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-8 h-7" onPress={deleteAccount}>
        <Text className="text-lg" style={{ color: `${theme.textColor}` }}>
          Konto Löschen
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Optionen;
