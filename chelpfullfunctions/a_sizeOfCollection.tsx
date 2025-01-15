import { db } from "@/firebase/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const getCollectionSize = async (collectionName: string): Promise<number> => {
  try {
    // Zugriff auf die gewünschte Sammlung
    const collectionRef = collection(db, collectionName);

    // Abrufen aller Dokumente in der Sammlung
    const querySnapshot = await getDocs(collectionRef);
    console.log("CollectionSize wird gelesen");

    // Anzahl der Dokumente ermitteln
    return querySnapshot.size; // 'size' gibt die Anzahl der Dokumente zurück
  } catch (error) {
    console.error("Fehler beim Abrufen der Sammlung:", error);
    throw new Error("Sammlung konnte nicht abgerufen werden");
  }
};

export const fetchSize = async () => {
  try {
    console.log("Collection wird gelesen");
    const size = await getCollectionSize("AllOrders");
  } catch (error) {
    console.error("Fehler beim Abrufen der Sammlung:", error);
  }
};
export const useCollectionSize = (collectionName: string) => {
  const [collectionSize, setCollectionSize] = useState<number>(0);

  useEffect(() => {
    // Referenz auf die Collection
    const colRef = collection(db, collectionName);

    // Realtime Listener für Änderungen in der Collection
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      setCollectionSize(snapshot.size); // Größe der Collection setzen
    });

    // Cleanup Funktion, um den Listener zu entfernen
    return () => unsubscribe();
  }, [collectionName]);

  return collectionSize;
};
