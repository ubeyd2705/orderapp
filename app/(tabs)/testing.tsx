import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Testing = () => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Speichert den Timer-Status in AsyncStorage
  const saveTimerToStorage = async (value: number) => {
    try {
      await AsyncStorage.setItem("timerValue", JSON.stringify(value));
    } catch (error) {
      console.error("Error saving timer:", error);
    }
  };

  // Lädt den Timer-Status aus AsyncStorage
  const loadTimerFromStorage = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("timerValue");
      if (storedValue !== null) {
        setTimer(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error("Error loading timer:", error);
    }
  };

  // Startet den Timer
  useEffect(() => {
    loadTimerFromStorage();

    let interval: string | number | NodeJS.Timeout | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer + 1;
          saveTimerToStorage(newTimer); // Timer-Wert speichern
          return newTimer;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  // Startet den Timer bei App-Start, wenn er läuft
  useEffect(() => {
    loadTimerFromStorage();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Timer</Text>
      <Text style={{ fontSize: 48 }}>{timer}/10</Text>

      <Text
        style={{
          marginTop: 20,
          color: isRunning ? "red" : "green",
          fontSize: 16,
        }}
        onPress={() => setIsRunning(!isRunning)}
      >
        {isRunning ? "Stop Timer" : "Start Timer"}
      </Text>
    </View>
  );
};

export default Testing;
