import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { rating } from "@/constants/types";
import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import Rating from "./Star_Rating";

const ShowRating = ({ ratingOfProduct }: { ratingOfProduct: string }) => {
  const [ratings, setratings] = useState<rating[]>([]);
  const loadRatingsFromBackend = async () => {
    const ratingsArray: rating[] = [];

    try {
      // Referenz auf die Collection "ratings"
      const ratingsRef = collection(db, "rating");

      // Query erstellen: Nach "createdAt" sortieren und auf 10 limitieren
      const q = query(
        ratingsRef,
        where("productTitle", "==", ratingOfProduct),
        limit(10) // Begrenzung auf 10 Einträge
      );

      // Daten abrufen
      const querySnapshot = await getDocs(q);

      // Ergebnisse verarbeiten und ins Array speichern
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ratingsArray.push({
          score: data.score, // Erwartet ein Zahlenfeld
          productTitle: data.productTitle, // Erwartet ein Stringfeld
          name: data.name, // Erwartet ein Stringfeld
          description: data.description, // Beschreibung
          imageSrc: data.imageSrc, // Sicherstellen, dass dieses Feld existiert
        });
      });
    } catch (error) {
      console.error("Fehler beim Laden der Ratings:", error);
    }

    setratings(ratingsArray);
  };
  useEffect(() => {
    loadRatingsFromBackend();
  }, [ratingOfProduct]);

  return (
    <View className="flex-1 mb-10 px-5 py-5">
      {ratings.map((rating, index) => (
        <Rating
          key={index}
          name={rating.name}
          score={rating.score}
          productName={rating.productTitle}
          description={rating.description}
          ImageSrc={rating.imageSrc}
        />
      ))}
    </View>
  );
};

export default ShowRating;
