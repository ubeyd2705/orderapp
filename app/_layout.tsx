import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import "../global.css";
import { View,Text } from 'react-native';
import {
  StyleSheet,
  Animated,
  Easing,
  Image,
  Platform,
} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [timerDone, setTimerDone] = useState(false);

  // Animation state
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Start at 80% scale
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation when the Splashscreen loads
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1, // Scale up to 100%
        duration: 1000, // 1-second animation
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, // Fully visible
        duration: 1000, // 1-second animation
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Timer for 3 seconds
    const timer = setTimeout(() => {
      setTimerDone(true);
    }, 3000);

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded && timerDone) {
      SplashScreen.hideAsync();
    }
  }, [loaded, timerDone]);

  if (!loaded || !timerDone) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Image
          source={require('../assets/images/abstract_Chef_Cooking_Restaurant_Free_Logo.png')} // Dein Bild hier
          style={[
            styles.splashImage,
            {
              transform: [{ scale: scaleAnim }], // Skalierungsanimation
              opacity: opacityAnim, // Opazitätsanimation
            },
          ]}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>Welcome to My App!</Text>
      </View>
    );
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444', // Hintergrundfarbe
  },
  splashImage: {
    width: 150, // Bildgröße
    height: 150,
  },
  splashText: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
