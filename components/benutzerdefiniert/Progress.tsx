import { View, Text, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import React from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

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

export default function ProgressBar({
  maxSteps,
  orderId,
}: {
  maxSteps: number;
  orderId: number;
}) {
  const [index, setIndex] = useState(0);
  const updateOrderStatus = async (orderId: number) => {
    try {
      // Referenz zur Collection 'AllOrders'
      const ordersRef = collection(db, "AllOrders");

      // Query erstellen, um das Dokument mit der gegebenen 'orderId' zu finden
      const q = query(ordersRef, where("id", "==", orderId));

      // Abrufen der Dokumente, die der Query entsprechen
      const querySnapshot = await getDocs(q);

      // Überprüfen, ob Dokumente gefunden wurden
      if (!querySnapshot.empty) {
        // Wenn Dokumente gefunden wurden, iteriere durch alle
        querySnapshot.forEach(async (docSnapshot) => {
          // Hole das Dokument und führe das Update durch
          const orderDocRef = doc(db, "AllOrders", docSnapshot.id);
          await updateDoc(orderDocRef, { isReady: true });
          console.log(`Order ${orderId} marked as ready.`);
        });
      } else {
        console.log(`No order found with id ${orderId}`);
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex >= maxSteps) {
          return prevIndex;
        } else {
          return prevIndex + 1;
        }
      });
    }, 1000);

    // Wenn die ProgressBar fertig ist, aktualisiere Firebase
    if (index === maxSteps) {
      updateOrderStatus(orderId); // Firebase aktualisieren
    }

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
