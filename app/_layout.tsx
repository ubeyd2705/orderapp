import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import { View, Text } from "react-native";
import { StyleSheet, Animated, Easing, Image, Platform } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { CartNumberContextProvider } from "@/constants/shoppingCartNumberContext";
import { OrderIdProvider } from "@/constants/orderIdContext";
import { AuthProvider } from "@/constants/authprovider";
import { ThemeContextProvider } from "../constants/_themeContext";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Stack2 = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/splashBackground.jpg")}
          style={styles.backgroundImage}
        />
        <View style={styles.overlay}>
          <Image
            source={require("../assets/images/splashLogo.png")}
            style={styles.centerImage}
          />
          <Text style={styles.text}>Restaurant App</Text>
        </View>
      </View>
    );
  }
  const headerBackground = Colors[colorScheme ?? "light"].background;
  const headerText = Colors[colorScheme ?? "light"].text;
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <CartNumberContextProvider>
          <OrderIdProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: headerBackground, // Dynamischer Hintergrund
                },
                headerTintColor: headerText, // Dynamische Textfarbe
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(stuffTabs)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="landing"
                options={{
                  title: "Anmelden",
                  headerBackTitle: "zurück",
                }}
              />
              <Stack.Screen
                name="chooseOfTable"
                options={{
                  title: "Tisch wählen",
                  headerBackTitle: "zurück",
                }}
              />
              <Stack.Screen
                name="redeemPoints"
                options={{
                  title: "Punkte einlösen",
                  headerBackTitle: "zurück",
                }}
              />
              <Stack.Screen
                name="impressum"
                options={{
                  title: "Impressum",
                  headerBackTitle: "zurück",
                }}
              />
              <Stack.Screen
                name="ListofFavoriteFoods"
                options={{
                  title: "favorites",
                  headerBackTitle: "zurück",
                }}
              />
              <Stack.Screen name="signUp" />
              <Stack.Screen
                name="s_changeData" // Zielseite
                options={{
                  title: "Daten",
                  // Haupttitel für diese Seite
                  headerBackTitle: "zurück",
                  // Text auf der Zurück-Taste
                }}
              />
            </Stack>
          </OrderIdProvider>
        </CartNumberContextProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 35,
    fontWeight: "900",
    color: "#0369A1",
  },
});
