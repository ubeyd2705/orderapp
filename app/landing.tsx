import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function LandingPage() {
  const colorScheme = useColorScheme();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleLogin = async () => {
    try {
      await login(email, password);
      if (email === "mitarbeiter@hotmail.com") {
        router.push("./(stuffTabs)");
      } else {
        router.push("/(tabs)");
      }
    } catch {
      console.log("passwort falsch");
    }
  };
  const handleGast = async () => {
    try {
      await login("gast@hotmail.com", "12345678");
      router.push("/(tabs)");
    } catch {
      console.log("passwort falsch");
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
        className="text-2xl font-bold mb-2"
        style={{
          color: `${Colors[colorScheme ?? "light"].text}`,
        }}
      >
        Willkommen!
      </Text>
      <Text
        className="text-base  text-center mb-8"
        style={{
          color: `${Colors[colorScheme ?? "light"].text2}`,
        }}
      >
        Bitte melden Sie sich an für mehr Vorteile
      </Text>

      <TextInput
        className="w-full p-4 border border-gray-300 rounded mb-4 bg-white"
        placeholder="E-Mail-Adresse"
        keyboardType="email-address"
        onChangeText={setEmail}
        style={{
          color: `${Colors[colorScheme ?? "light"].text2}`,
          backgroundColor: `${Colors[colorScheme ?? "light"].background}`,
        }}
      />
      <TextInput
        className="w-full p-4 border border-gray-300 rounded mb-4 bg-white"
        placeholder="Passwort"
        secureTextEntry
        onChangeText={setPassword}
        style={{
          color: `${Colors[colorScheme ?? "light"].text2}`,
          backgroundColor: `${Colors[colorScheme ?? "light"].background}`,
        }}
      />
      <TouchableOpacity
        className="bg-sky-600 py-3 px-6 rounded-3xl mb-1 w-full h-14 justify-center items-center"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-bold">Anmelden</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-white py-3 px-6 rounded-full border border-sky-600 w-full justify-center items-center"
        onPress={handleGast}
      >
        <Text className="text-sky-600 text-lg font-bold">
          Als Gast beitreten
        </Text>
      </TouchableOpacity>
      <View className="mt-10  flex-row justify-center items-center">
        <Text
          style={{
            color: `${Colors[colorScheme ?? "light"].text2}`,
          }}
        >
          du hast noch kein Konto ?
        </Text>
        <TouchableOpacity
          className=""
          onPress={() => {
            router.push("/signUp");
          }}
        >
          <Text className=" text-sky-600 text-lg font-bold m-1">
            Registrieren
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
