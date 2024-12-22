import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/constants/authprovider";

const s_changeData = () => {
  const { user, updateUserProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const handleSave = async () => {
    if (firstName && lastName) {
      await updateUserProfile(firstName, lastName);
      alert("Änderung aktualisiert");
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
    <View className="h-52  ml-6 mr-6 mt-6">
      <TextInput
        className="border p-2 mb-4 rounded-md h-12"
        placeholder="Vorname"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        className="border p-2 mb-4  rounded-md h-12"
        placeholder="Nachname"
        value={lastName}
        onChangeText={setLastName}
      />
      <TouchableOpacity
        className="border w-24 h-10 flex items-center justify-center bg-sky-700"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold">Speichern</Text>
      </TouchableOpacity>
    </View>
  );
};

export default s_changeData;
