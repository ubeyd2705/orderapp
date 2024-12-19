import React, { useEffect, useState } from "react";
import { CartNumberContext } from "@/constants/shoppingCartNumberContext";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import ProductUi from "./Single-Pr";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Product } from "@/constants/types";
import { getProducts } from "@/constants/_products";
import { useOrderID } from "@/constants/orderIdContext";

export default function ConcepPr({ categoryFilter }: { categoryFilter: any }) {
  const [produkte, setProdukte] = useState<Product[]>([]);

  const { setCartNumber } = React.useContext(CartNumberContext);
  const { orderId } = useOrderID();

  const addToOrder = async (prdID: number) => {
    setCartNumber((prev: any) => prev + 1);

    // Produkt suchen
    const productToAdd: Product | undefined = produkte.find(
      (pr) => pr.id === prdID
    );

    if (!productToAdd) {
      return;
    }

    //Hier wird Order Datenbank erstellt

    try {
      // Referenz auf die Orders-Collection
      const ordersRef = collection(db, `myOrders${orderId}`);

      // Abfrage: Gibt es bereits ein Produkt mit der gleichen ID?
      const q = query(ordersRef, where("myProduct.id", "==", productToAdd.id));
      const querySnapshot = await getDocs(q);
      console.log("Quoteeeeeeeee");

      if (!querySnapshot.empty) {
        // Produkt existiert -> Anzahl erhöhen
        const docRef = querySnapshot.docs[0].ref; // Verweis auf das existierende Dokument
        const existingData = querySnapshot.docs[0].data();
        const newAnzahl = (existingData.Anzahl || 0) + 1; // Anzahl um 1 erhöhen

        await updateDoc(docRef, { Anzahl: newAnzahl }); // Dokument aktualisieren
      } else {
        // Produkt existiert nicht -> Neues Dokument erstellen
        await addDoc(ordersRef, {
          myProduct: productToAdd,
          Anzahl: 1, // Startwert
        });
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern der Bestellung.");
    }
  };

  const loadFilteredProducts = async () => {
    const allProducts = await getProducts();
    let filteredArray = allProducts.filter(
      (prdct) => prdct.categoryId === categoryFilter
    );
    setProdukte(filteredArray);
  };

  useEffect(() => {
    loadFilteredProducts();
  }, [categoryFilter]);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 375,
      }}
    >
      {produkte.map((product, index) => (
        <ProductUi
          id={product.id}
          index={index}
          title={product.title}
          imageSrc={product.imageSrc}
          ratingScore={product.ratingScore}
          price={product.price}
          categoryId={product.categoryId}
          orderedItemId={addToOrder}
        />
      ))}
    </ScrollView>
  );
}
