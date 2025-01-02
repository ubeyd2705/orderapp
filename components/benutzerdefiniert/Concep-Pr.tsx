import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import ProductUi from "./Single-Pr";
import { Product } from "@/constants/types";
import { getProducts } from "@/constants/_products";
import { useAuth } from "@/constants/authprovider";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { CartNumberContext } from "@/constants/shoppingCartNumberContext";
import { useOrderID } from "@/constants/orderIdContext";

export default function ConcepPr({ categoryFilter }: { categoryFilter: any }) {
  const { setCartNumber } = React.useContext(CartNumberContext);
  const { orderId } = useOrderID();

  const [produkte, setProdukte] = useState<Product[]>([]);
  const {
    addToFavoriteProduct,
    removeFromFavoriteProducts,
    fetchFavoriteProducts,
    favoriteProducts,
    user,
  } = useAuth();

  const loadFilteredProducts = async () => {
    const allProducts = await getProducts();
    const filteredArray = allProducts.filter(
      (prdct) => prdct.categoryId === categoryFilter
    );

    // Favoritenstatus für den aktuellen Benutzer überprüfen
    const updatedProducts = filteredArray.map((product) => ({
      ...product,
      isfavorite: favoriteProducts.some(
        (fav: { id: number }) => fav.id === product.id
      ),
    }));

    setProdukte(updatedProducts);
  };
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

  useEffect(() => {
    if (user) {
      fetchFavoriteProducts().catch((error) =>
        console.error("Fehler beim Abrufen der Favoriten:", error)
      );
    }

    // Favoriten des aktuellen Benutzers abrufen
  }, [user]);

  useEffect(() => {
    loadFilteredProducts();
  }, [categoryFilter, favoriteProducts]); // Neu laden, wenn sich Favoriten ändern

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 375,
      }}
    >
      {produkte.map((product, index) => (
        <ProductUi
          key={product.id || index}
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
          isfavorite={product.isfavorite}
        />
      ))}
    </ScrollView>
  );
}
