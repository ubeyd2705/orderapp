import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useTheme } from "@/constants/_themeContext";
import { useAuth } from "@/constants/authprovider";
import { auth } from "@/firebase/firebase";
import { deleteUser } from "firebase/auth";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
/**
 * Optionen ist eine Komponente, die dem Benutzer verschiedene Einstellungen wie das Impressum,
 * Abmelden und das Löschen des Kontos anbietet.
 *
 * @component
 * @example
 * return <Optionen />;
 */

const Optionen = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  /**
   * Löscht das Benutzerkonto und zeigt eine Bestätigungsmeldung an.
   * Bei einem Fehler wird eine Fehlermeldung angezeigt.
   */

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
      className="flex h-50 w-full p-5"
      style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      <Text
        className={`text-2xl font-semibold`}
        style={{ color: `${theme.textColor}` }}
      >
        Optionen
      </Text>
      <TouchableOpacity
        className="mt-8 h-7 flex flex-row"
        onPress={() => router.push("/impressum")}
      >
        {/* Navigiere zum Impressum */}
        <MaterialIcons name="info" size={20} color="black" />
        <Text className="text-lg ml-2" style={{ color: `${theme.textColor}` }}>
          Impressum
        </Text>
      </TouchableOpacity>
      {/* Benutzer abmelden */}
      <TouchableOpacity className="mt-8 h-7 flex flex-row" onPress={logout}>
        <MaterialIcons name="logout" size={20} color="black" />
        <Text className="text-lg ml-2" style={{ color: `${theme.textColor}` }}>
          abmelden
        </Text>
      </TouchableOpacity>
      {/* Konto löschen */}

      <TouchableOpacity className="mt-8 h-7 flex-row" onPress={deleteAccount}>
        <MaterialIcons name="delete" size={20} color="black" />
        <Text className="text-lg ml-2" style={{ color: `${theme.textColor}` }}>
          Konto Löschen
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Optionen;
