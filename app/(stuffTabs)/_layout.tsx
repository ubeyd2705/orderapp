import { Redirect, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, View, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/constants/authprovider";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { user } = useAuth();

  if (!user || user?.email !== "mitarbeiter@hotmail.com") {
    return <Redirect href="/landing"></Redirect>;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            // backgroundColor: 'rgba(239, 68, 68, 0.9)', // Setzt einen halbtransparenten Hintergrund auf iOS
            backdropFilter: "blur(10px)",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Eingehend",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="checklist"
              color={color}
              style={{ padding: 8 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="delivered"
        options={{
          title: "Serviert",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="tray.full"
              color={color}
              style={{ padding: 8 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
