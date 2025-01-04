import {
  Platform,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Vibration,
  ScrollView,
} from "react-native";

import { useTischnummer } from "@/constants/context";
import ShoppingCart from "@/components/benutzerdefiniert/Shoppingcart";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/benutzerdefiniert/ConfirmModal";
import { Order, SingleOrder } from "@/constants/types";
import ConfirmedOrders from "@/components/benutzerdefiniert/ConfirmedOrders";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useOrderID } from "@/constants/orderIdContext";
import SlideUpModal from "@/components/benutzerdefiniert/GiveRatingComponent";
import { useAuth } from "@/constants/authprovider";

const useCollectionSize = (collectionName: string) => {
  const [collectionSize, setCollectionSize] = useState<number>(0);

  useEffect(() => {
    // Referenz auf die Collection
    const colRef = collection(db, collectionName);

    // Realtime Listener für Änderungen in der Collection
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      setCollectionSize(snapshot.size); // Größe der Collection setzen
    });

    // Cleanup Funktion, um den Listener zu entfernen
    return () => unsubscribe();
  }, [collectionName]);

  return collectionSize;
};

export default function TabTwoScreen() {
  const { tischnummer } = useTischnummer();
  const [isShoppingCartVisible, setIsShoppingCartVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isRatingModalVisible, setisRatingModalVisible] = useState(false);
  const [myOrder, setMyOrder] = useState<Order[]>([]);
  const { fetchOrCreateCounter, incrementCounter, orderId } = useOrderID();
  const [Duration, setDuration] = useState<number>(0);
  const size = useCollectionSize("AllOrders");
  const [idOfOrderToRate, setidOfOrderToRate] = useState(0);
  const {
    vibration,
    user,
    fetchVibration,
    addLoyaltyPoints,
    resetLoyaltyPoints,
    loyaltyPoints,
    updateGifts,
    fetchLoyaltyPoints,
  } = useAuth();
  const [newTotalPayment, setnewTotalPayment] = useState<number>(0);

  function handleOpenShoppingCart() {
    setIsShoppingCartVisible(true);
  }
  function handleCloseShoppingCart() {
    setIsShoppingCartVisible(false);
  }
  function openRatingModal(id: number) {
    setisRatingModalVisible(true);
    setidOfOrderToRate(id);
  }

  // Hier wird eine einzelne Bestellung zur allen Bestellungen hinzuegfügt ("AllOrders")
  const addOrderToArray = async (
    orderID: number,
    orderToAdd: Order[],
    newDuration: number,
    isRated: boolean,
    isDelivered: false,
    newTotalPayment: number,
    requestPayment: boolean,
    isPaid: boolean,
    startedPreparing: boolean
  ) => {
    try {
      // Referenz auf die Orders-Collection
      const ordersRef = collection(db, "AllOrders");

      // Produkt existiert nicht -> Neues Dokument erstellen
      await addDoc(ordersRef, {
        myOrder: orderToAdd,
        id: orderID, // Startwert
        duration: newDuration,
        isRated: isRated,
        isDelivered: isDelivered,
        tableNr: tischnummer,
        orderedUser: user?.uid,
        totalPayment: newTotalPayment,
        requestPayment: requestPayment,
        isPaid: isPaid,
        startedPreparing: startedPreparing,
      });
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern der Bestellung. ");
    }
  };

  //vibration wird hier aktualisert
  useEffect(() => {
    if (user) {
      fetchVibration(user.uid);
      fetchOrCreateCounter();
    }
  }, [vibration, user]);

  useEffect(() => {
    if (user) {
      fetchLoyaltyPoints(user.uid);
    }
  }, [loyaltyPoints, user]);

  function handleConfirmShoppingCart(
    newOrder: any,
    newDuration: number,
    TotalPayment: number
  ) {
    setMyOrder(newOrder);
    setDuration(newDuration);
    setIsShoppingCartVisible(false);
    setnewTotalPayment(TotalPayment);
    setTimeout(
      () => {
        setIsConfirmModalVisible(true); // ConfirmModal nach Verzögerung öffnen
      },
      Platform.OS === "ios" ? 500 : 0
    ); // 500ms Verzögerung für iOS
  }

  const handleConfirmConfirmModal = async () => {
    setIsConfirmModalVisible(false);
    setIsShoppingCartVisible(false);

    addLoyaltyPoints(myOrder.length);
    if (loyaltyPoints != undefined && loyaltyPoints >= 20) {
      updateGifts(true);
      resetLoyaltyPoints();
    }

    addOrderToArray(
      orderId,
      myOrder,
      Duration,
      false,
      false,
      newTotalPayment,
      false,
      false,
      false
    );
    incrementCounter();

    if (vibration) {
      Vibration.vibrate(100);
    }

    Toast.show({
      type: "success",
      text1: `Bestellung ${orderId + 1}`,
      text2: "Ihre Bestellung wird vorbereitet",
    });
  };

  function handleCloseConfirmModal() {
    setIsConfirmModalVisible(false);
  }

  return (
    <SafeAreaView className="h-full flex justify-between ">
      <View className="flex flex-row justify-between items-center px-4  mt-10 mx-4">
        <Text className="text-black font-bold md:text-4xl text-2xl ">
          Bestellungen
        </Text>
        <Text className="px-5 py-3 mb-2 bg-white rounded-lg shadow-md text-black text-sm">
          {tischnummer ?? "nicht gesetzt"}
        </Text>
      </View>
      <ScrollView className="bg-gray-200">
        <ConfirmedOrders
          BestellId={orderId}
          ratingButton={openRatingModal}
        ></ConfirmedOrders>
      </ScrollView>
      {isConfirmModalVisible && (
        <ConfirmModal
          isActive={isConfirmModalVisible}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmConfirmModal}
        />
      )}

      <View className="bg-red-500">
        <SlideUpModal
          isVisible={isRatingModalVisible}
          BestellId={idOfOrderToRate}
          close={() => {
            setisRatingModalVisible(false);
          }}
        ></SlideUpModal>
      </View>
      <View>
        <ShoppingCart
          isActive={isShoppingCartVisible}
          handleModal={handleConfirmShoppingCart}
          handleClose={handleCloseShoppingCart}
          orderIdCounter={orderId}
          ordersize={size}
        />
      </View>
      <View className="  justify-center items-center pl-4 pr-4 md:h-80 h-16 md:mb-60 mb-16 p-2 pb-0">
        <TouchableOpacity
          className="w-full justify-center items-center mr-4 ml-4 bg-sky-700 rounded-lg h-full "
          onPress={handleOpenShoppingCart}
          activeOpacity={0.7}
        >
          <Text className="text-lg text-white font-medium">
            Bestellung einsehen
          </Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
}
