import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { SingleOrder } from "@/constants/types";

const IncomingOrders = () => {
  const [orders, setOrders] = useState<SingleOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SingleOrder | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Abfrage mit Filter für isDelivered: false
    const q = query(
      collection(db, "AllOrders"),
      where("isDelivered", "==", false)
    );

    // Listener registrieren
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData: SingleOrder[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({
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
          time: doc.data().time,
        });
      });
      setOrders(ordersData);
    });

    // Cleanup-Funktion, um den Listener zu entfernen
    return () => unsubscribe();
  }, []);

  // Funktion, um isDelivered auf true zu setzen
  const markAsDelivered = async (orderId: number) => {
    try {
      // Abfrage, um das Dokument mit der entsprechenden `orderId` zu finden
      const q = query(
        collection(db, "AllOrders"),
        where("id", "==", orderId) // Suche nach `orderId`
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Es wird davon ausgegangen, dass `orderId` eindeutig ist
        const docRef = querySnapshot.docs[0].ref;

        // Aktualisiere das Attribut `isDelivered` auf `true`
        await updateDoc(docRef, {
          isDelivered: true,
        });

        setModalVisible(false); // Schließe das Modal
      } else {
        console.error("Kein Dokument mit dieser orderId gefunden.");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Bestellung:", error);
    }
  };

  const orderPress = (order: SingleOrder) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center ">
          <View className="bg-white rounded-md p-5 w-3/4">
            <Text className="text-lg font-bold">
              Bestellung {selectedOrder?.id}
            </Text>
            <View>
              {selectedOrder?.order.map((item, index) => (
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
              <TouchableOpacity
                className="rounded-sm p-2 bg-green-500 mt-1"
                onPress={() => {
                  if (selectedOrder?.id !== undefined) {
                    markAsDelivered(selectedOrder.id);
                  } else {
                    console.error("Die Bestellung hat keine gültige ID.");
                  }
                }}
              >
                <Text className="text-white">Serviert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="flex flex-row justify-center flex-wrap">
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id} // Wichtiger Key für React
            className={`rounded-md h-20 w-28 m-5 justify-center items-center shadow shadow-slate-400 
               ${order.isPaid ? "bg-green-500" : "bg-gray-200"}
            `}
            activeOpacity={0.7}
            onPress={() => orderPress(order)}
          >
            <Text>Bestellung {order.id + 1}</Text>
            <Text>Tisch: {order.tableNr}</Text>
            <Text>Um: {order.time}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default IncomingOrders;
