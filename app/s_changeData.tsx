import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/constants/authprovider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const s_changeData = () => {
  const colorScheme = useColorScheme();
  const dropDownAlertRef = useRef();
  const { user, updateUserProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const handleSave = async () => {
    if (firstName && lastName && dropDownAlertRef) {
      await updateUserProfile(firstName, lastName);
      alert("Bitte Felder ausfüllen");
    } else {
      alert("Bitte Felder ausfüllen");
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
