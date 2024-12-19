import { View, Text, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import React from "react";

const Progress = ({ step, steps }: { step: number; steps: number }) => {
  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current; // Startwert auf 0
  const reactive = useRef(new Animated.Value(0)).current;
  const [color, setcolor] = useState("bg-red-600");

  // Animation starten
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 1200,
      useNativeDriver: true,
    }).start(); // Animation starten
  }, [reactive]);

  // Breite der Fortschrittsleiste basierend auf Schritt berechnen
  useEffect(() => {
    const progressWidth = (width * step) / steps;
    reactive.setValue(progressWidth); // Reaktiven Wert setzen
    if (step / steps > 0.3 && step / steps <= 0.5 && color != "bg-red-300") {
      setcolor("bg-red-300");
    }
    if (step / steps > 0.5 && step / steps != 1 && color != "bg-lime-300") {
      setcolor("bg-lime-300");
    }
    if (step / steps === 1) {
      setcolor("bg-lime-700");
    }
  }, [step, width, steps]);

  return (
    <>
      <View
        className="h-[10px] bg-black/10 rounded-full overflow-hidden w-full"
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;
          setWidth(newWidth); // Breite speichern
        }}
      >
        <Animated.View
          className={`${color}`}
          style={{
            height: "100%",
            borderRadius: 10 / 2,
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, width],
                  outputRange: [-width, 0], // Von -width bis 0 animieren
                }),
              },
            ],
          }}
        ></Animated.View>
      </View>
      <Text className="text-white font-bold text-xs absolute">
        {steps - step === 0
          ? "Ihre Bestellung ist in Kürze bereit"
          : `${steps - step}`}
      </Text>
    </>
  );
};

export default function ProgressBar({ maxSteps }: { maxSteps: number }) {
  const [index, setindex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setindex((prevIndex) => {
        if (prevIndex >= maxSteps) {
          return prevIndex;
        } else {
          return prevIndex + 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [index]);

  return (
    <>
      <StatusBar hidden />
      <Progress step={index} steps={maxSteps} />
    </>
  );
}
