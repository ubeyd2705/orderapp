import { Redirect, Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, View, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useCartNumberContext } from "@/constants/shoppingCartNumberContext";
import { useAuth } from "@/constants/authprovider";
export default function TabLayout() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/landing"></Redirect>;
  }

  const { CartNumber } = useCartNumberContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0a7ea4",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            // backgroundColor: 'rgba(239, 68, 68, 0.9)', // Setzt einen halbtransparenten Hintergrund auf iOS
            backdropFilter: "blur(20px)",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Bestellen",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="fork.knife"
              color={color}
              style={{ padding: 8 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="einkaufswagen"
        options={{
          title: "Einkaufswagen",
          tabBarIcon: ({ color }) => (
            <View>
              {/* Original-Icon */}
              <IconSymbol size={28} name="cart.fill" color={color} />
              {/* Badge anzeigen, wenn es Artikel gibt */}
              {CartNumber > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -10,
                    backgroundColor: "red",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                  >
                    {CartNumber}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="bewertungTab"
        options={{
          title: "Beste Produkte",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="star.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
