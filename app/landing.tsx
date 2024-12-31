import { useAuth } from "@/constants/authprovider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleLogin = async () => {
    try {
      await login(email, password);
      if (email === "mitarbeiter@hotmail.com") {
        console.log("Hallo es ist im rihctigen drin");
        router.push("./(stuffTabs)");
      } else {
        console.log("Es ist nihct im rivhtigen drin");
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
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen!</Text>
      <Text style={styles.subtitle}>
        Treten Sie unserer Community bei und entdecken Sie großartige Inhalte.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail-Adresse"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/signUp");
        }}
      >
        <Text style={styles.buttonText}>Registrieren</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGast}>
        <Text style={styles.buttonText}>Ohne Anmeldung</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Anmelden
        </Text>
      </TouchableOpacity>
    </View>
  );
}

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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
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
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6200EE",
  },
  secondaryButtonText: {
    color: "#6200EE",
  },
});
