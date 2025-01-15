import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { getUserNameParts } from "@/chelpfullfunctions/getUserInitals";

const s_changeData = () => {
  const colorScheme = useColorScheme();
  const { user, updateUserProfile } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const handleSave = async () => {
    try {
      console.log(firstName, lastName); // Überprüfen, ob die Namen korrekt gesetzt sind
      if (firstName && lastName) {
        updateUserProfile(firstName, lastName).then(() =>
          alert("Aktualisiert")
        );
      } else {
        alert("Bitte Felder ausfüllen");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Profils:", error);
    }
  };
  useEffect(() => {
    if (user?.displayName) {
      const [first, last] = user.displayName.split(" ");
      setFirstName(first);
      setLastName(last);
    }
  }, [user]);

  return (
    <View
      className="h-full w-full"
      style={{
        backgroundColor: `${Colors[colorScheme ?? "light"].background2}`,
      }}
    >
      <View
        className="h-52  ml-6 mr-6 mt-6"
        style={{
          backgroundColor: `${Colors[colorScheme ?? "light"].background2}`,
        }}
      >
        <TextInput
          className="border p-2 mb-4 rounded-md h-12"
          placeholder="Vorname"
          value={firstName}
          onChangeText={setFirstName}
          style={{
            borderColor: `${Colors[colorScheme ?? "light"].text2}`,
            color: `${Colors[colorScheme ?? "light"].text2}`,
          }}
        />
        <TextInput
          className="border p-2 mb-4  rounded-md h-12"
          placeholder="Nachname"
          value={lastName}
          onChangeText={setLastName}
          style={{
            borderColor: `${Colors[colorScheme ?? "light"].text2}`,
            color: `${Colors[colorScheme ?? "light"].text2}`,
          }}
        />
        <TouchableOpacity
          className="border w-24 h-10 flex items-center justify-center bg-sky-700"
          onPress={handleSave}
        >
          <Text className="text-white font-semibold">Speichern</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default s_changeData;
