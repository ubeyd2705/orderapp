import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Order } from "@/constants/types";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { CartNumberContext } from "@/constants/shoppingCartNumberContext";
import { useTischnummer } from "@/constants/context";
import { allImageSources } from "@/constants/data";
import { useAuth } from "@/constants/authprovider";
import { useTheme } from "@/constants/_themeContext";

export default function ShoppingCart({
  isActive,
  handleModal,
  handleClose,
  ordersize,
}: {
  isActive: boolean;
  handleModal: any;
  handleClose: any;
  ordersize: number;
}) {
  const [bestellungen, setbestellungen] = useState<Order[]>([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalOrderduration, setTotalOrderduration] = useState<number>(0);
  const [isShoppingConfirmButtonDisabled, setisShoppingConfirmButtonDisabled] =
    useState(false);
  const { setCartNumber } = React.useContext(CartNumberContext);
  const { tischnummer } = useTischnummer();
  const { user, localHasChosen } = useAuth();
  const { theme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    setbestellungen([]);
    setTotalPayment(0);
    setTotalOrderduration(0);
  }, [ordersize]);

  useEffect(() => {
    if (isActive) {
      getOrders();
    }
  }, [isActive]);

  useEffect(() => {
    if (!user) {
      console.error("Kein Benutzer angemeldet5");
      return;
    }

    // Listener für die Collection `CurrentOrder${user.uid}`
    const q = query(collection(db, `CurrentOrder${user.uid}`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let totalQuantity = 0;

      // Summiere alle Werte des Attributs "Anzahl"
      querySnapshot.forEach((doc) => {
        totalQuantity += doc.data().Anzahl;
      });

      // Aktualisiere den Einkaufswagen-Zähler oder andere Abhängigkeiten
      setCartNumber(totalQuantity); // Aktualisiere den globalen Kontext
    });

    // Cleanup-Funktion, um den Listener zu entfernen, wenn der Benutzer abgemeldet wird oder der Effekt neu ausgeführt wird
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (bestellungen.length === 0 || localHasChosen === false) {
      setisShoppingConfirmButtonDisabled(true);
    } else {
      setisShoppingConfirmButtonDisabled(false);
    }
  }, [bestellungen]);

  const getOrders = async () => {
    let addPrice = 0;
    let addQuantities = 0;
    //Das ist ein array von Bestellprodukten. Es ist nur eine einzige Bestellung
    const orderArray: Order[] = [];
    //Das ist ein Array von allen Bestellungen mit ID, und array von bestellprodukten
    if (!user) {
      console.error("Kein Benutzer angemeldet6");
      return;
    }

    // Dynamische Referenz auf die Collection 'CurrentOrder{user.uid}'
    const q = query(collection(db, `CurrentOrder${user.uid}`));
    const querySnapshot = await getDocs(q);
    const orderDurationArray: number[] = [];
    querySnapshot.forEach((doc) => {
      addPrice += doc.data().myProduct.price * doc.data().Anzahl;
      orderDurationArray.push(doc.data().myProduct.orderDuration);
      addQuantities += doc.data().Anzahl;
      orderArray.push({
        pr: doc.data().myProduct,
        quantity: doc.data().Anzahl,
        id: doc.id, // Speichern der Dokument-ID
      });
    });
    const duration = Math.max(...orderDurationArray);

    setbestellungen(orderArray);
    setTotalPayment(addPrice);
    setTotalOrderduration(duration);
  };

  const handleRemoveButton = async (id: number, quantity: number) => {
    // Finden des Dokuments mit dem Titel
    const orderDoc = bestellungen.find((order) => order.pr.id === id);
    if (orderDoc && quantity > 1) {
      // Firestore-Dokument mit der gefundenen ID aktualisieren
      const orderRef = doc(db, `CurrentOrder${user?.uid}`, orderDoc.id);
      await updateDoc(orderRef, {
        Anzahl: quantity - 1, // Den Titel auf "Hallo" ändern
      });
    } else if (orderDoc) {
      const orderRef = doc(db, `CurrentOrder${user?.uid}`, orderDoc.id);
      await deleteDoc(orderRef);
    }

    // Die Bestellungen neu laden, um die UI zu aktualisieren
    getOrders();
  };
  const handleAddButton = async (id: number, quantity: number) => {
    // Finden des Dokuments mit dem Titel
    const orderDoc = bestellungen.find((order) => order.pr.id === id);
    if (orderDoc) {
      // Firestore-Dokument mit der gefundenen ID aktualisieren
      const orderRef = doc(db, `CurrentOrder${user?.uid}`, orderDoc.id);
      await updateDoc(orderRef, {
        Anzahl: quantity + 1,
      });
    }

    // Die Bestellungen neu laden, um die UI zu aktualisieren
    getOrders();
  };

  return (
    <Modal visible={isActive} animationType="slide" transparent={true}>
      <View className="flex-1" />
      <View
        className="flex-1 justify-end  rounded-xl"
        style={{ backgroundColor: `${theme.backgroundColor}` }}
      >
        <View
          className="px-4 py-6 rounded-t-2xl"
          style={{ backgroundColor: `${theme.backgroundColor3}` }}
        >
          <View className="flex-row justify-between items-center">
            <Text
              className="text-xl font-bold mb-4"
              style={{ color: `${theme.textColor}` }}
            >
              Ihre Bestellungen
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-2xl text-gray-500">x</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={bestellungen}
            renderItem={({ item }) => (
              <View className="flex-row items-center border-b border-gray-300 py-2">
                <Image
                  source={allImageSources[item.pr.imageSrc]}
                  className="w-16 h-16 rounded-lg mr-3"
                />
                <View className="flex-1">
                  <View className="flex-row justify-between">
                    <Text
                      className="font-bold"
                      style={{ color: `${theme.textColor}` }}
                    >
                      {item.pr.title}
                    </Text>
                    <View className="flex-row">
                      <TouchableOpacity
                        onPress={() =>
                          handleRemoveButton(item.pr.id, item.quantity)
                        }
                      >
                        <Text className="text-4xl text-sky-700">-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleAddButton(item.pr.id, item.quantity)
                        }
                      >
                        <Text className="text-4xl text-sky-700 ">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {item.pr.ratingScore !== undefined ? (
                    <Text className="text-gray-500">
                      {Number(item.pr.ratingScore.toFixed(2))}⭐
                    </Text>
                  ) : (
                    <Text>0</Text>
                  )}
                  <Text className="text-gray-500">
                    ca. {item.pr.orderDuration}min
                  </Text>
                  <View className="flex-row justify-between mt-1">
                    <Text
                      className="font-bold"
                      style={{ color: `${theme.textColor}` }}
                    >
                      Anzahl: {item.quantity}
                    </Text>
                    <Text className="font-bold">{item.pr.price}€</Text>
                  </View>
                </View>
              </View>
            )}
          />

          <View className="mt-4">
            <View className="flex-row justify-between">
              <Text
                className="font-bold text-lg"
                style={{ color: `${theme.textColor}` }}
              >
                Gesamtbetrag
              </Text>
              <Text className="font-bold text-lg">{totalPayment}€</Text>
            </View>
            <Text className="text-gray-500">
              Es wird ca {totalOrderduration != null ? totalOrderduration : "0"}{" "}
              Minuten dauern
            </Text>
            <TouchableOpacity
              className={`${
                isShoppingConfirmButtonDisabled ? "bg-gray-300" : "bg-sky-700"
              } mt-4 py-3 rounded-lg`}
              onPress={() =>
                handleModal(bestellungen, totalOrderduration, totalPayment)
              }
              disabled={isShoppingConfirmButtonDisabled}
            >
              <Text className="text-white text-lg font-bold text-center">
                Bestätigen
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/");
                handleClose();
              }}
              className="mt-4"
            >
              <Text className="text-sky-700 text-lg text-center">
                Einkauf fortsetzen →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
