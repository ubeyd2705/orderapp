import { View, Text, ScrollView } from "react-native";
import React from "react";

const Impressum = () => {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <ScrollView className="bg-white rounded-lg shadow-lg p-6">
        <Text className="text-2xl font-bold text-center mb-4">Impressum</Text>

        <Text className="text-lg font-semibold text-gray-700">Anbieter:</Text>
        <Text className="text-gray-600 mb-4">
          Max Mustermann {"\n"}
          Musterstraße 123 {"\n"}
          12345 Musterstadt {"\n"}
          Deutschland
        </Text>

        <Text className="text-lg font-semibold text-gray-700">Kontakt:</Text>
        <Text className="text-gray-600 mb-4">
          Telefon: +49 (0)123 4567890 {"\n"}
          E-Mail: info@musterapp.de
        </Text>

        <Text className="text-lg font-semibold text-gray-700">
          Verantwortlich für den Inhalt:
        </Text>
        <Text className="text-gray-600 mb-4">
          Max Mustermann {"\n"}
          Musterstraße 123 {"\n"}
          12345 Musterstadt
        </Text>

        <Text className="text-lg font-semibold text-gray-700">
          Umsatzsteuer-ID:
        </Text>
        <Text className="text-gray-600 mb-4">
          DE123456789 (gemäß §27a Umsatzsteuergesetz)
        </Text>

        <Text className="text-lg font-semibold text-gray-700">
          Haftungsausschluss:
        </Text>
        <Text className="text-gray-600 mb-4">
          Alle Inhalte wurden sorgfältig erstellt, dennoch können wir keine
          Haftung für die Richtigkeit und Vollständigkeit der Informationen
          übernehmen. {"\n"}
          Externe Links wurden geprüft, dennoch liegt die Verantwortung für
          deren Inhalte bei den jeweiligen Betreibern.
        </Text>
      </ScrollView>
    </View>
  );
};

export default Impressum;
