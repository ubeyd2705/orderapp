import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { SingleOrder } from "@/constants/types";
import { DeleteDocInCollectionWithId } from "@/chelpfullfunctions/b_DeletDocInCollection";

const IncomingOrders = () => {
  const [orders, setOrders] = useState<SingleOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SingleOrder>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "AllOrders"),
      where("isDelivered", "==", true)
    );

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
        });
      });
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);
  const orderPress = (order: SingleOrder) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };
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
    setModalVisible(false);
  }

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
              {selectedOrder != undefined ? (
                <TouchableOpacity
                  className="rounded-sm p-2 mt-1 bg-red-500"
                  onPress={() => deleteDocumentButton(selectedOrder.id)}
                >
                  <Text className="text-black">Löschen</Text>
                </TouchableOpacity>
              ) : (
                ""
              )}

              <TouchableOpacity
                className="rounded-sm p-2 mt-1 bg-green-500"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-black">bezahlt</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="flex flex-row justify-center flex-wrap">
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className={`rounded-md h-20 w-28 ${
              order.isPaid
                ? "bg-green-600"
                : order.requestPayment
                ? "bg-red-500"
                : "bg-gray-200"
            }  m-5 justify-center items-center shadow shadow-slate-400 }`}
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
