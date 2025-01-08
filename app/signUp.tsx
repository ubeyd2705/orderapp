import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/constants/authprovider"; // Update the path to your AuthProvider
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

/**
 * Die SignUp-Komponente ermöglicht es Benutzern, sich für die Anwendung zu registrieren.
 *
 * @component
 * @returns {JSX.Element} - Die Registrierungskomponente.
 */
const SignUp = () => {
  const colorScheme = useColorScheme();

  // Lokaler Zustand für Eingabefelder
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");

  const router = useRouter(); // Router für Navigation
  const { signup } = useAuth(); // Zugriff auf die Authentifizierungsfunktionen von AuthProvider

  /**
   * funktion für die registrieung des Benutzers
   * Ruft die `signup`-Funktion auf, um den Benutzer mit E-Mail, Passwort, Vorname und Nachname zu registrieren.
   * Bei Erfolg wird der Benutzer zu der Hauptseite mit den Tabs navigiert.
   *
   * @async
   * @function
   * @returns {Promise<void>} - Führt die Registrierung durch und navigiert bei Erfolg.
   */

  const handleSignUp = async () => {
    try {
      // Registrieren
      await signup(email, password, firstName, lastName);

      // Navigiere zu Tabs
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <View
      className="flex-1 justify-center items-center px-5"
      style={{
        backgroundColor: `${Colors[colorScheme ?? "light"].background2}`,
      }}
    >
      <Text
        className="text-2xl font-bold  mb-5"
        style={{
          color: `${Colors[colorScheme ?? "light"].text}`,
        }}
      >
        Registrieren
      </Text>

      {/* Eingabefeld für den Vornamen */}
      <TextInput
        className="w-full p-4 border border-gray-300 rounded bg-white mb-4"
        placeholder="Vorname"
        value={firstName}
        onChangeText={setfirstName}
        style={{
          color: `${Colors[colorScheme ?? "light"].text2}`,
          backgroundColor: `${Colors[colorScheme ?? "light"].background}`,
        }}
      />

      {/* Eingabefeld für den Nachnamen */}
      <TextInput
        className="w-full p-4 border border-gray-300 rounded bg-white mb-4"
        placeholder="Nachname"
        value={lastName}
        onChangeText={setlastName}
        style={{
          color: `${Colors[colorScheme ?? "light"].text2}`,
          backgroundColor: `${Colors[colorScheme ?? "light"].background}`,
        }}
      />

      {/* Eingabefeld für die E-Mail-Adresse */}
      <TextInput
        className="w-full p-4 border border-gray-300 rounded bg-white mb-4"
        placeholder="E-Mail-Adresse"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          color: `${Colors[colorScheme ?? "light"].text2}`,
          backgroundColor: `${Colors[colorScheme ?? "light"].background}`,
        }}
      />

      {/* Eingabefeld für das Passwort */}
      <TextInput
        className="w-full p-4 border border-gray-300 rounded bg-white mb-4"
        placeholder="Passwort"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          color: `${Colors[colorScheme ?? "light"].text2}`,
          backgroundColor: `${Colors[colorScheme ?? "light"].background}`,
        }}
      />

      {/* Button zur Registrierung */}
      <TouchableOpacity
        className="bg-sky-600 py-3 px-8 rounded-full mt-4"
        onPress={handleSignUp}
      >
        <Text className="text-white text-base font-bold">Registrieren</Text>
      </TouchableOpacity>
    </View>
  );
};

//Stylesheet für die Komponente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0369A1",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUp;
