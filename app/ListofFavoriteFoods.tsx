import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Product } from "@/constants/types";
import { useAuth } from "@/constants/authprovider";
import ProductUi from "../components/benutzerdefiniert/Single-Pr";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useOrderID } from "@/constants/orderIdContext";
import { CartNumberContext } from "@/constants/shoppingCartNumberContext";

const ListofFavoriteFoods = () => {
  const {
    fetchFavoriteProducts,
    user,
    favoriteProducts,
    addToFavoriteProduct,
    removeFromFavoriteProducts,
  } = useAuth();
  const { orderId } = useOrderID();
  const { setCartNumber } = React.useContext(CartNumberContext);

  useEffect(() => {
    // if (user) {
    //   fetchFavoriteProducts(user.uid).catch((error) =>
    //     console.error("Fehler beim Abrufen der Favoriten:", error)
    //   );
    // }
    // Favoriten des aktuellen Benutzers abrufen
  }, [user]);
  const addToOrder = async (prdID: number) => {
    // Produkt suchen
    const productToAdd: Product | undefined = favoriteProducts.find(
      (pr: { id: number }) => pr.id === prdID
    );

    if (!productToAdd) {
      return;
    }

    //Hier wird Order Datenbank erstellt

    try {
      // Referenz auf die Orders-Collection
      const ordersRef = collection(db, `CurrentOrder${user?.uid}`);

      // Abfrage: Gibt es bereits ein Produkt mit der gleichen ID?
      const q = query(ordersRef, where("myProduct.id", "==", productToAdd.id));
      const querySnapshot = await getDocs(q);
      console.log("Es wird gelesen");

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
  return (
    <ScrollView>
      {favoriteProducts.map((product) => (
        <ProductUi
          key={product.id}
          id={product.id}
          title={product.title}
          imageSrc={product.imageSrc}
          ratingScore={product.ratingScore}
          price={product.price}
          categoryId={product.categoryId}
          orderedItemId={addToOrder}
          addToFavorite={() => addToFavoriteProduct(product)}
          deleteFromFavorite={() =>
            removeFromFavoriteProducts(product.id.toString())
          }
          isfavorite={true}
        />
      ))}
    </ScrollView>
  );
};

export default ListofFavoriteFoods;
