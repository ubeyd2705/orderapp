import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/constants/authprovider";
import DeliveredOrders from "@/components/benutzerdefiniert/DeliveredOrders";

/**
 * Die `delivered` Komponente zeigt eine Liste der servierten Bestellungen an.
 * Zusätzlich gibt es eine Schaltfläche zum Abmelden.
 *
 * @component
 * @returns {JSX.Element} Die gerenderte Komponente für servierte Bestellungen.
 */

const delivered = () => {
  // useAuth Hook zum Abrufen der Logout-Funktion
  const { logout } = useAuth();
  return (
    <View className="w-full h-full ">
      {/* Kopfzeile mit Titel und Abmeldeknopf */}
      <View className="flex flex-row justify-between items-center  mt-28 mx-4">
        <Text className="text-black font-bold md:text-4xl text-2xl ">
          servierte Bestellungen
        </Text>
        <TouchableOpacity onPress={logout}>
          <Text>sign out</Text>
        </TouchableOpacity>
      </View>
      {/* Bereich für die Anzeige der gelieferten Bestellungen */}
      <View>
        <DeliveredOrders></DeliveredOrders>
      </View>
    </View>
  );
};

export default delivered;
