import { db } from "@/firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useEffect } from "react";

// context.ts
import React, { useContext, useState } from "react";

export const OrderIdContext = createContext<number | any>(0);

export const useOrderID = () => useContext(OrderIdContext);

export const OrderIdProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orderId, setOrderId] = useState<number>(0);

  const fetchOrCreateCounter = async () => {
    try {
      const docRef = doc(db, "AllOrdersCounter", "counterDocId"); // Ersetzen Sie "counterDocId" durch die tatsächliche ID des Dokuments
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrderId(data.counter || 0); // Setzen Sie den Counter-Wert
      } else {
        // Dokument existiert nicht -> Erstellen Sie es mit Initialwert 0
        await setDoc(docRef, { counter: 0 });
        setOrderId(0);
        console.log("Dokument erstellt mit initialem Wert 0.");
      }
    } catch (error) {
      console.error("Fehler beim Abrufen oder Erstellen des Counters:", error);
    }
  };

  const incrementCounter = async () => {
    try {
      const docRef = doc(db, "AllOrdersCounter", "counterDocId"); // Ersetzen Sie "counterDocId" durch die tatsächliche ID des Dokuments
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentCounter = docSnap.data().counter || 0;
        const newCounter = currentCounter + 1;

        // Aktualisieren Sie den Counter-Wert in der Datenbank
        await updateDoc(docRef, { counter: newCounter });
        setOrderId(newCounter); // Aktualisieren Sie den lokalen Zustand
      } else {
        console.log("Dokument nicht gefunden!");
      }
    } catch (error) {
      console.error("Fehler beim Erhöhen des Counters:", error);
    }
  };

  return (
    <OrderIdContext.Provider
      value={{ orderId, setOrderId, fetchOrCreateCounter, incrementCounter }}
    >
      {children}
    </OrderIdContext.Provider>
  );
};
