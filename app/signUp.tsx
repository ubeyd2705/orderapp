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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const router = useRouter();
  const { signup } = useAuth();

  const handleSignUp = async () => {
    try {
      const userCredential = await signup(email, password, firstName, lastName);
      console.log("User registered:", userCredential);
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrieren</Text>
      <TextInput
        style={styles.input}
        placeholder="Vorname"
        value={firstName}
        onChangeText={setfirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nachname"
        value={lastName}
        onChangeText={setlastName}
      />

      <TextInput
        style={styles.input}
        placeholder="E-Mail-Adresse"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrieren</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    backgroundColor: "#6200EE",
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
