import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const getCollectionSize = async (collectionName: string): Promise<number> => {
  try {
    // Zugriff auf die gewünschte Sammlung
    const collectionRef = collection(db, collectionName);

    // Abrufen aller Dokumente in der Sammlung
    const querySnapshot = await getDocs(collectionRef);

    // Anzahl der Dokumente ermitteln
    return querySnapshot.size; // 'size' gibt die Anzahl der Dokumente zurück
  } catch (error) {
    console.error("Fehler beim Abrufen der Sammlung:", error);
    throw new Error("Sammlung konnte nicht abgerufen werden");
  }
};

export const fetchSize = async () => {
  try {
    const size = await getCollectionSize("AllOrders");
    console.log(`Die Sammlung AllOrders hat ${size} Dokumente.`);
  } catch (error) {
    console.error("Fehler beim Abrufen der Sammlung:", error);
  }
};
