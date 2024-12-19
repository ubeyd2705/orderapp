import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const RatingComponent = ({
  title,
  rating,
  setRating,
}: {
  title: string;
  rating: number; // Kontrollierter Zustand für das Rating
  setRating: (score: number) => void; // Funktion, um den Zustand zu aktualisieren
}) => {
  // Funktion zum Rendern der Sterne
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      return (
        <TouchableOpacity
          key={starNumber}
          onPress={() => setRating(starNumber)} // Aktualisiert das Rating in der Hauptkomponente
        >
          <Text
            className={`text-4xl ${
              starNumber <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View className="mb-2 flex">
      {/* Titel */}
      <Text className="text-gray-600 font-extrabold text-4xl">{title}</Text>
      <View className="flex-row">{renderStars()}</View>
    </View>
  );
};

export default RatingComponent;
