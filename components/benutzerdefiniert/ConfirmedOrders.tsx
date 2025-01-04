import { View, Text, TouchableOpacity, Vibration, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { SingleOrder } from "@/constants/types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { DeleteDocInCollectionWithId } from "@/chelpfullfunctions/b_DeletDocInCollection";
import ProgressBar from "./Progress";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { useAuth } from "@/constants/authprovider";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";

export default function Test({
  ratingButton,
  BestellId,
}: {
  ratingButton: any;
  BestellId: number;
}) {
  const [AllOrders, setAllOrders] = useState<SingleOrder[]>([]);
  const [SelectedOrder, setSelectedOrder] = useState<SingleOrder | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { vibration, user, fetchVibration } = useAuth();

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

          if (change.type === "modified") {
            if (existingOrderIndex !== -1) {
              const prevOrder = updatedOrders[existingOrderIndex];
              updatedOrders[existingOrderIndex] = {
                ...prevOrder,
                isRated: changedOrder.isRated,
                startedPreparing: changedOrder.startedPreparing,
                isPaid: changedOrder.isPaid,
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
        startedPreparing: doc.data().startedPreparing,
        tableNr: doc.data().tableNr,
        orderedUser: doc.data().orderedUser,
        totalPayment: doc.data().totalPayment,
        requestPayment: doc.data().requestPayment,
        isPaid: doc.data().isPaid,
      });
    });
    const sortedArray = orderArray.sort((a, b) => a.id - b.id);
    setAllOrders(sortedArray);
  };

  useEffect(() => {
    loadAllOrdersfromBackend();
  }, [BestellId]);
  useEffect(() => {
    if (user) {
      fetchVibration(user.uid);
    }
  }, [vibration, user]);

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
  async function handleRequestPayment(orderId: number) {
    console.log(vibration);
    if (vibration) {
      Vibration.vibrate(100);
    }
    Toast.show({
      type: "info",
      text1: "Bezahlen",
      text2: "Mitarbeiter kommt in Kürze zu Ihrem Tisch",
    });
    try {
      const q = query(collection(db, "AllOrders"), where("id", "==", orderId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.error(`Keine Bestellung mit ID ${orderId} gefunden.`);
        return;
      }
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { requestPayment: true });
      console.log(`Request Payment für Bestellung ${orderId} gesetzt.`);
      loadAllOrdersfromBackend(); // Liste neu laden
    } catch (error) {
      console.error(
        `Fehler beim Aktualisieren von requestPayment für Bestellung ${orderId}:`,
        error
      );
    }
  }
  const orderPress = (order: SingleOrder) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };
  return (
    <>
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center ">
          <View className="bg-white rounded-md p-5 w-3/4">
            <Text className="text-lg font-bold">
              Bestellung {SelectedOrder?.id}
            </Text>
            <View>
              {SelectedOrder?.order.map((item, index) => (
                <Text key={index} className="p-2 border-b border-gray-300">
                  {item.quantity}x {item.pr.title}
                </Text>
              ))}
            </View>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                className="rounded-sm p-2 mt-1"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-black">Schließen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View className="flex justify-center items-center p-4">
        {AllOrders.map((order) => (
          <View
            key={order.id}
            className="flex justify-center items-center w-full"
          >
            <View className="bg-white flex justify-between w-full h-24 rounded-md mb-0 m-5">
              <TouchableOpacity
                className="h-4/6 flex justify-center items-center"
                onPress={() => orderPress(order)}
              >
                <Text className="text-xl font-semibold">
                  {AllOrders.length === 0
                    ? "Noch keine Bestellung"
                    : `Bestellung: ${order.id + 1}`}
                </Text>
              </TouchableOpacity>

              <View className="h-2/6 flex flex-row justify-center">
                {/* Stornieren Button */}
                <TouchableOpacity
                  disabled={order.startedPreparing}
                  className={` w-28 justify-center items-center mr-7 mb-1 ${
                    order.startedPreparing ? "bg-gray-300" : "bg-gray-100"
                  }   rounded-lg`}
                  activeOpacity={0.7}
                  onPress={() => deleteDocumentButton(order.id)}
                >
                  <Text className="text-sky-700">Stornieren</Text>
                </TouchableOpacity>
                {/* Bewerten Button */}
                <TouchableOpacity
                  className={` w-28 justify-center items-center rounded-lg bg-gray-100 mb-1
                }`}
                  activeOpacity={order.isRated ? 1 : 0.7} // Unclickable, wenn isRated true ist
                  onPress={() => {
                    if (!order.isRated) ratingButton(order.id); // Nur klicken, wenn isRated false ist
                  }}
                  disabled={order.isRated} // Deaktiviert den Button, wenn isRated true ist
                >
                  {!order.isRated ? (
                    <Text className="text-sky-700">Bewerten</Text>
                  ) : (
                    <Ionicons name="checkmark" size={20} color="green" />
                  )}
                </TouchableOpacity>
                {/* Bezahlen Button */}
                <TouchableOpacity
                  className="w-28 justify-center items-center rounded-lg bg-gray-100  ml-7 mb-1"
                  activeOpacity={0.7}
                  onPress={() => handleRequestPayment(order.id)}
                >
                  {!order.isPaid ? (
                    <Text className="text-sky-700">Bezahlen</Text>
                  ) : (
                    <Ionicons name="checkmark" size={20} color="green" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View className="h-26 w-full justify-center items-center">
              <ProgressBar maxSteps={30} orderId={order.id}></ProgressBar>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}
