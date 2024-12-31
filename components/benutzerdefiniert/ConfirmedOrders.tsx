import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SingleOrder } from "@/constants/types";
import {
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { DeleteDocInCollectionWithId } from "@/chelpfullfunctions/b_DeletDocInCollection";
import ProgressBar from "./Progress";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";

export default function Test({
  ratingButton,
  BestellId,
}: {
  ratingButton: any;
  BestellId: number;
}) {
  const [AllOrders, setAllOrders] = useState<SingleOrder[]>([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const ordersRef = collection(db, "AllOrders");

    // Listener für Änderungen in der Collection
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      setAllOrders((prevOrders) => {
        const updatedOrders = [...prevOrders];

        snapshot.docChanges().forEach((change) => {
          const changedOrder = change.doc.data();
          const orderId = changedOrder.id;
          const existingOrderIndex = updatedOrders.findIndex(
            (order) => order.id === orderId
          );

          // Prüfen, ob sich `isRated` geändert hat
          if (change.type === "modified") {
            const prevOrder = updatedOrders[existingOrderIndex];

            if (prevOrder && prevOrder.isRated !== changedOrder.isRated) {
              updatedOrders[existingOrderIndex] = {
                ...prevOrder,
                isRated: changedOrder.isRated, // Nur `isRated` aktualisieren^
                isReady: changedOrder.isReady,
              };
            }
          }
        });

        // Rückgabe der aktualisierten Liste
        return updatedOrders;
      });
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  ///////////////////////////////////////
  //Liste Aller Bestellungen werden geladen//
  ///////////////////////////////////////
  ///////////////////////////////////////
  const loadAllOrdersfromBackend = async () => {
    const orderArray: SingleOrder[] = [];
    if (!currentUser) {
      console.error("Kein Benutzer ist angemeldet.");
      return orderArray;
    }
    const isMitarbeiter = currentUser.email === "Mitarbeiter@hotmail.com";

    let q;
    if (isMitarbeiter) {
      q = query(collection(db, "AllOrders")); // Alle Bestellungen abfragen
    } else {
      q = query(
        collection(db, "AllOrders"),
        where("orderedUser", "==", currentUser.uid) // Nur Bestellungen des aktuellen Benutzers abrufen
      );
    }
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      orderArray.push({
        id: doc.data().id,
        order: doc.data().myOrder,
        duration: doc.data().duration,
        isRated: doc.data().isRated,
        isDelivered: doc.data().isDelivered,
        isReady: doc.data().isReady,
        tableNr: doc.data().tableNr,
        orderedUser: doc.data().orderedUser,
        totalPayment: doc.data().totalPayment,
      });
    });
    const sortedArray = orderArray.sort((a, b) => a.id - b.id);
    setAllOrders(sortedArray);
  };

  useEffect(() => {
    loadAllOrdersfromBackend();
  }, [BestellId]);

  async function deleteDocumentButton(id: number) {
    DeleteDocInCollectionWithId(id, "AllOrders");

    //Alle Werte in der Sammlung löschen
    const collectionRef2 = collection(db, `myOrders${id}`);
    const q2 = query(collectionRef2);
    const querySnapshot2 = await getDocs(q2);
    console.log("Es wird gelesen");
    querySnapshot2.forEach(async (doc2) => {
      await deleteDoc(doc2.ref);
      console.log("Alle Daten sollten gelöscht werden");
    });
    loadAllOrdersfromBackend();
  }
  return (
    <View className="flex justify-center items-center p-4">
      {AllOrders.map((order) => (
        <View
          key={order.id}
          className="flex justify-center items-center w-full"
        >
          <View className="bg-white flex justify-between w-full h-24 rounded-md mb-0 m-5">
            <View className="h-4/6 flex justify-center items-center">
              <Text className="text-xl font-semibold">
                {AllOrders.length === 0
                  ? "Noch keine Bestellung"
                  : `Bestellung: ${order.id + 1}`}
              </Text>
            </View>

            <View className="h-2/6 flex flex-row justify-between">
              {/* Stornieren Button */}
              <TouchableOpacity
                disabled={order.isReady}
                className={`w-1/3 justify-center items-center ${
                  order.isReady ? "bg-gray-300" : ""
                }  border-t border-gray-200`}
                activeOpacity={0.7}
                onPress={() => deleteDocumentButton(order.id)}
              >
                <Text className="text-sky-700">Stornieren</Text>
              </TouchableOpacity>
              {/* Bewerten Button */}
              <TouchableOpacity
                className={`w-1/3 justify-center items-center border-t border-l border-gray-200
                }`}
                activeOpacity={order.isRated ? 1 : 0.7} // Unclickable, wenn isRated true ist
                onPress={() => {
                  if (!order.isRated) ratingButton(order.id); // Nur klicken, wenn isRated false ist
                }}
                disabled={order.isRated} // Deaktiviert den Button, wenn isRated true ist
              >
                {!order.isRated ? (
                  <Text>Bewerten</Text>
                ) : (
                  <Ionicons name="checkmark" size={20} color="green" />
                )}
              </TouchableOpacity>
              {/* Bezahlen Button */}
              <TouchableOpacity
                className="w-1/3 justify-center items-center border-t border-l border-gray-200"
                activeOpacity={0.7}
              >
                <Text className="text-sky-700">Bezahlen</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="h-26 w-full justify-center items-center">
            <ProgressBar
              maxSteps={order.duration * 10}
              orderId={order.id}
            ></ProgressBar>
          </View>
        </View>
      ))}
    </View>
  );
}
