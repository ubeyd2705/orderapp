import { View, Text, TouchableOpacity, Vibration, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { SingleOrder } from "@/constants/types";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { useAuth } from "@/constants/authprovider";
import Toast from "react-native-toast-message";
import { useTheme } from "@/constants/_themeContext";

/**
 * `ConfirmedOrdersOfAUser` Komponente zeigt alle Bestellungen des Nutzers an, ermöglicht das Bezahlen und Bewerten von Bestellungen.
 * Die Komponente zeigt eine Liste der Bestellungen und bietet Buttons zum Bezahlen und Bewerten der Bestellungen.
 * Ein Modal erscheint, wenn auf eine Bestellung geklickt wird, um Details anzuzeigen und Aktionen wie Bezahlen oder Bewerten durchzuführen.
 *
 * @component
 *
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {Function} props.ratingButton - Funktion, um eine Bestellung zu bewerten. Wenn Rating button geklickt ->es wird orderId rausgegeben und es öffnet
 * sich ratingModal
 * @param {number} props.BestellId - Die ID der aktuellen Bestellung.
 *
 * @returns {JSX.Element} Die gerenderte Benutzeroberfläche.
 */

export default function ConfirmedOrdersOfAUser({
  ratingButton,
  BestellId,
}: {
  ratingButton: any;
  BestellId: number;
}) {
  const [AllOrders, setAllOrders] = useState<SingleOrder[]>([]);
  const [SelectedOrder, setSelectedOrder] = useState<SingleOrder | null>(null);
  const [orderInformationModalVisible, setorderInformationModalVisible] =
    useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { vibration, user, fetchVibration } = useAuth();
  const { theme } = useTheme();
  const [paymentModalVisible, setpaymentModalVisible] = useState(false);

  /**
   * Listener für AllOrders. wenn sich ein
   * Wert von AllOrders sich ändern, also eine bestellung bewertet und bezahlt wurde, wird das
   * lokale allOrders aktualisiert
   */
  useEffect(() => {
    const ordersRef = collection(db, "AllOrders");

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

  //**
  // liste aller Bestellungen werden geladen. wenn Bestellid sich ändert also eine
  // wenn eine Bestellung hinzuegfüt wird
  // */
  const loadAllOrdersfromBackend = async () => {
    const orderArray: SingleOrder[] = [];
    if (!currentUser) {
      console.error("Kein Benutzer ist angemeldet.4");
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
        time: doc.data().time,
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

  /**
   * isPaid wird auf True gesetzt. Dadurch wird die Anzeige beim Mitarbeiter geändert
   * @param orderId id der Bestellung
   *
   */

  const handleIsPaid = async (orderId: number) => {
    if (vibration) {
      Vibration.vibrate(100);
    }
    Toast.show({
      type: "success",
      text1: "Zahlung",
      text2: "Sie haben erfolgreich gezahlt",
    });
    try {
      const q = query(collection(db, "AllOrders"), where("id", "==", orderId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.error(`Keine Bestellung mit ID ${orderId} gefunden.`);
        return;
      }
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { isPaid: true });
    } catch (error) {
      console.error(
        `Fehler beim Aktualisieren von isPaid für Bestellung ${orderId}:`,
        error
      );
    }
  };
  /**
   * RequestPayment wird auf true gesetzt. Der Mitarbeiter kommt zum Tisch
   * für Barzahlung
   * @param orderId
   *
   */
  async function handleRequestPayment(orderId: number) {
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
    } catch (error) {
      console.error(
        `Fehler beim Aktualisieren von requestPayment für Bestellung ${orderId}:`,
        error
      );
    }
  }
  const orderPress = (order: SingleOrder) => {
    setSelectedOrder(order);
    setorderInformationModalVisible(true);
  };
  return (
    <>
      <Modal
        visible={orderInformationModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setorderInformationModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center ">
          <View className="rounded-md p-5 w-3/4">
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
                onPress={() => setorderInformationModalVisible(false)}
              >
                <Text className="text-black">Schließen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={paymentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setpaymentModalVisible(false)}
      >
        <TouchableOpacity
          onPressOut={() => setpaymentModalVisible(false)}
          className="absolute top-0 left-0 right-0 bottom-0 flex-row justify-center items-center "
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)", // 50% Transparenz
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 }, // Verschiebung des Schattens
            shadowOpacity: 0.25, // Transparenz des Schattens
            shadowRadius: 3.84, // Weichheit des Schattens
            elevation: 5,
          }}
        >
          <View
            className=" max-w-md rounded-lg p-6 "
            style={{
              backgroundColor: `${theme.backgroundColor}`,
            }}
          >
            <Text
              className="text-lg font-semibold mb-4"
              style={{
                color: `${theme.textColor2}`,
              }}
            >
              Möchten Sie die Bestellung bestätigen ?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="py-2 px-4 rounded-lg"
                style={{
                  backgroundColor: `${theme.backgroundColor3}`,
                }}
                onPress={() => {
                  if (SelectedOrder) {
                    handleRequestPayment(SelectedOrder?.id);
                  }
                  setpaymentModalVisible(false);
                }}
              >
                <Text>Barzahlung</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2 px-4 rounded-lg"
                style={{
                  backgroundColor: `${theme.backgroundColor3}`,
                }}
                onPress={() => {
                  if (SelectedOrder) {
                    handleIsPaid(SelectedOrder?.id);
                  }
                  setpaymentModalVisible(false);
                }}
              >
                <Text>Kartenzahlung</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <View className="flex justify-center items-center p-8">
        {AllOrders.map((order) => (
          <View
            key={order.id}
            className="flex justify-center items-center w-full"
          >
            <View
              className="flex justify-between w-full h-24 rounded-lg mb-0 m-5"
              style={{
                backgroundColor: `${theme.backgroundColor}`,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
              }}
            >
              <TouchableOpacity
                className="h-12  flex justify-center items-center"
                onPress={() => orderPress(order)}
              >
                <Text
                  className="text-xl font-semibold"
                  style={{ color: `${theme.textColor}` }}
                >
                  {AllOrders.length === 0
                    ? "Noch keine Bestellung"
                    : `Bestellung: ${order.id + 1}`}
                </Text>
              </TouchableOpacity>
              <View className="  flex flex-row justify-center">
                {/* Bewerten Button */}
                <TouchableOpacity
                  className={` w-40 h-10 justify-center items-center rounded-2xl bg-gray-100  mr-5 mb-2
                }`}
                  style={{
                    backgroundColor: theme.backgroundColor3,
                    shadowColor: "#000", // Schattenfarbe
                    shadowOffset: { width: 0, height: 2 }, // Offset für den Schatten
                    shadowOpacity: 0.4, // Transparenz des Schattens
                    shadowRadius: 3.84, // Unschärfe des Schattens
                    elevation: 5, // Android-spezifische Schattenhöhe
                  }}
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
                  className="w-40 h-10 justify-center items-center rounded-2xl  ml-5 mb-2"
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: theme.backgroundColor3,
                    shadowColor: "#000", // Schattenfarbe
                    shadowOffset: { width: 0, height: 2 }, // Offset für den Schatten
                    shadowOpacity: 0.4, // Transparenz des Schattens
                    shadowRadius: 3.84, // Unschärfe des Schattens
                    elevation: 5, // Android-spezifische Schattenhöhe
                  }}
                  onPress={() => {
                    setpaymentModalVisible(true);
                    setSelectedOrder(order);
                  }}
                >
                  {!order.isPaid ? (
                    <Text className="text-sky-700">Bezahlen</Text>
                  ) : (
                    <Ionicons name="checkmark" size={20} color="green" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}
