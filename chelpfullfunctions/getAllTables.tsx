import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { table } from "@/constants/types";

export const getTables = async (): Promise<table[]> => {
  try {
    // Referenz zur Collection "tables"
    const tablesCollection = collection(db, "tables");

    // Abrufen aller Dokumente aus der Collection
    const snapshot = await getDocs(tablesCollection);

    // Mapping der Daten in ein Array von Table-Objekten
    const tables: table[] = await Promise.all(
      snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        // Überprüfen, ob "isBooked" existiert, falls nicht, als leeres Array setzen
        const isBooked = data.isBooked || [];

        // Wenn "isBooked" noch nicht existiert, in die Collection ein leeres Array setzen
        if (!data.isBooked) {
          const tableRef = doc(db, "tables", docSnapshot.id);
          await updateDoc(tableRef, { isBooked: [] });
        }

        return {
          number: data.number,
          isBooked: isBooked,
          amountOfGuests: data.amountOfGuests,
          isBookedBy: data.isBookedBy,
        };
      })
    );

    // Sortieren der Tabellen nach der Nummer
    const sortedTables = tables.sort((a, b) => a.number - b.number);

    return sortedTables;
  } catch (error) {
    console.error("Fehler beim Abrufen der Tabellen: ", error);
    throw new Error("Fehler beim Abrufen der Tabellen");
  }
};
export const getAllBookedTimesOfATable = async (
  tableNumber: number
): Promise<string[]> => {
  try {
    // Referenz zur Collection "tables"
    const tablesCollection = collection(db, "tables");

    // Query, um das Dokument mit der gegebenen tableNumber zu finden
    const q = query(tablesCollection, where("number", "==", tableNumber));

    // Abrufen der Dokumente, die der Query entsprechen
    const snapshot = await getDocs(q);

    // Überprüfen, ob das Dokument existiert
    if (snapshot.empty) {
      console.log("Tabelle nicht gefunden");
      return [];
    }

    // Extrahieren des isBooked Arrays aus dem ersten gefundenen Dokument
    const docData = snapshot.docs[0].data();
    const isBooked = docData.isBooked || []; // Standardwert leeres Array

    return isBooked;
  } catch (error) {
    console.error("Fehler beim Abrufen der gebuchten Zeiten: ", error);
    throw new Error("Fehler beim Abrufen der gebuchten Zeiten");
  }
};
export const deleteBookedTable = async (
  tableNumber: number,
  time: string
): Promise<void> => {
  try {
    // Referenz zur Collection "tables"
    const tablesCollection = collection(db, "tables");

    // Query, um das Dokument mit der gegebenen tableNumber zu finden
    const q = query(tablesCollection, where("number", "==", tableNumber));

    // Abrufen der Dokumente, die der Query entsprechen
    const snapshot = await getDocs(q);

    // Überprüfen, ob das Dokument existiert
    if (snapshot.empty) {
      throw new Error(
        `Tisch mit der Nummer ${tableNumber} wurde nicht gefunden.`
      );
    }

    // Das erste Dokument (wir gehen davon aus, dass die Tischnummer eindeutig ist)
    const docRef = snapshot.docs[0].ref;
    const docData = snapshot.docs[0].data();

    // Extrahieren des isBooked Arrays
    const isBooked: string[] = docData.isBooked || []; // Standardwert leeres Array

    // Entfernen des Zeit-Strings aus isBooked
    const updatedIsBooked = isBooked.filter(
      (bookedTime) => bookedTime !== time
    );

    // Aktualisieren des Dokuments
    await updateDoc(docRef, { isBooked: updatedIsBooked });

    console.log(
      `Zeit "${time}" wurde erfolgreich aus Tisch ${tableNumber} entfernt.`
    );
  } catch (error) {
    console.error("Fehler beim Entfernen der gebuchten Zeit: ", error);
    throw new Error(
      `Fehler beim Entfernen der gebuchten Zeit für Tisch ${tableNumber}`
    );
  }
};
