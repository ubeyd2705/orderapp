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
      where("isDelivered", "==", true)
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
          isReady: doc.data().isReady,
          tableNr: doc.data().tableNr,
          orderedUser: doc.data().orderedUser,
          totalPayment: doc.data().totalPayment,
        });
      });
      setOrders(ordersData);
    });

    // Cleanup-Funktion, um den Listener zu entfernen
    return () => unsubscribe();
  }, []);
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
              <Text className="font-bold text-lg">
                {selectedOrder?.totalPayment}€
              </Text>
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

      <View className="flex flex-row justify-center flex-wrap">
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id} // Wichtiger Key für React
            className={`rounded-md h-20 w-28 bg-gray-200 m-5 justify-center items-center shadow shadow-slate-400 }`}
            activeOpacity={0.7}
            onPress={() => orderPress(order)}
          >
            <Text>Bestellung {order.id + 1}</Text>
            <Text>Tisch: {order.tableNr}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default IncomingOrders;
