import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
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
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { CartNumberContext } from "@/constants/shoppingCartNumberContext";
import { useTischnummer } from "@/constants/context";

export default function ShoppingCart({
  isActive,
  handleModal,
  handleClose,
  orderIdCounter,
  ordersize,
}: {
  isActive: boolean;
  handleModal: any;
  handleClose: any;
  orderIdCounter: number;
  ordersize: number;
}) {
  const [bestellungen, setbestellungen] = useState<Order[]>([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalOrderduration, setTotalOrderduration] = useState(0);
  const [isShoppingConfirmButtonDisabled, setisShoppingConfirmButtonDisabled] =
    useState(false);
  const { setCartNumber } = React.useContext(CartNumberContext);
  const { tischnummer } = useTischnummer();

  const router = useRouter();

  useEffect(() => {
    setbestellungen([]);
    setTotalPayment(0);
    setTotalOrderduration(0);
    setCartNumber(0);
  }, [ordersize]);

  useEffect(() => {
    if (isActive) {
      getOrders();
    }
  }, [isActive]);

  useEffect(() => {
    if (bestellungen.length === 0 || tischnummer === undefined) {
      setisShoppingConfirmButtonDisabled(true);
    } else {
      setisShoppingConfirmButtonDisabled(false);
    }
  }, [bestellungen]);

  const getOrders = async () => {
    let addPrice = 0;
    let addOrderDuration = 0;
    let addQuantities = 0;
    //Das ist ein array von Bestellprodukten. Es ist nur eine einzige Bestellung
    const orderArray: Order[] = [];
    //Das ist ein Array von allen Bestellungen mit ID, und array von bestellprodukten
    const q = query(collection(db, `myOrders${orderIdCounter}`));
    console.log("Redner: es wird Gelesen");
    const querySnapshot = await getDocs(q);
    console.log("Quoteeeeeeeeeeeee");
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
    setCartNumber(addQuantities);
  };

  const handleRemoveButton = async (id: number, quantity: number) => {
    // Finden des Dokuments mit dem Titel
    const orderDoc = bestellungen.find((order) => order.pr.id === id);
    if (orderDoc && quantity > 1) {
      // Firestore-Dokument mit der gefundenen ID aktualisieren
      const orderRef = doc(db, `myOrders${orderIdCounter}`, orderDoc.id);
      await updateDoc(orderRef, {
        Anzahl: quantity - 1, // Den Titel auf "Hallo" ändern
      });
    } else if (orderDoc) {
      const orderRef = doc(db, `myOrders${orderIdCounter}`, orderDoc.id);
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
      const orderRef = doc(db, `myOrders${orderIdCounter}`, orderDoc.id);
      await updateDoc(orderRef, {
        Anzahl: quantity + 1,
      });
    }

    // Die Bestellungen neu laden, um die UI zu aktualisieren
    getOrders();
  };

  return (
    <Modal visible={isActive} animationType="slide" transparent={true}>
      <View style={styles.backdrop} />
      <View style={styles.modalContainer}>
        <View style={styles.cartContainer}>
          <View style={styles.header}>
            <Text style={styles.title} className="mb-4">
              Ihre Bestellungen
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={bestellungen}
            renderItem={({ item }) => (
              <View style={styles.productContainer}>
                <Image
                  source={{ uri: item.pr.imageSrc }}
                  style={styles.productImage}
                />
                <View style={styles.productDetails}>
                  <View style={styles.actionsContainer}>
                    <Text style={styles.productName}>{item.pr.title}</Text>
                    <View style={styles.addAndreduceButtoncontainer}>
                      <TouchableOpacity
                        onPress={() =>
                          handleRemoveButton(item.pr.id, item.quantity)
                        }
                      >
                        <Text style={styles.removeButton}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleAddButton(item.pr.id, item.quantity)
                        }
                      >
                        <Text style={styles.removeButton}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.productColor}>
                    {item.pr.ratingScore}⭐
                  </Text>
                  <Text style={styles.quantity}>
                    ca. {item.pr.orderDuration}min
                  </Text>

                  <View style={styles.actionsContainer}>
                    <Text style={styles.productPrice}>
                      Anzahl: {item.quantity}
                    </Text>
                    <Text style={styles.productPrice}>{item.pr.price}€</Text>
                  </View>
                </View>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>Gesamtbetrag</Text>
              <Text style={styles.subtotalAmount}>{totalPayment}€</Text>
            </View>
            <Text style={styles.shippingInfo}>
              Es wird ca {totalOrderduration} Minuten dauern
            </Text>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                isShoppingConfirmButtonDisabled && styles.disabledButton,
              ]}
              onPress={() => handleModal(bestellungen, totalOrderduration)}
              disabled={isShoppingConfirmButtonDisabled}
            >
              <Text style={styles.checkoutButtonText}>Bestätigen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/");
                handleClose();
              }}
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>Continue Shopping →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cartContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: "gray",
  },
  productContainer: {
    flexDirection: "row",
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productColor: {
    fontSize: 14,
    color: "gray",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  addAndreduceButtoncontainer: {
    flexDirection: "row",
  },
  quantity: {
    fontSize: 14,
    color: "gray",
  },
  removeButton: {
    fontSize: 40,
    color: "#0369A1",
  },
  footer: {
    marginTop: 16,
  },
  subtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shippingInfo: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: "#0369A1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
  },
  continueButton: {
    marginTop: 16,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    color: "#0369A1",
  },
});
