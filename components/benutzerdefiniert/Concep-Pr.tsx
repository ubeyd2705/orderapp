import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import ProductUi from "./Single-Pr";
import { Product } from "@/constants/types";
import { getProducts } from "@/constants/_products";
import { useAuth } from "@/constants/authprovider";
import { useTheme } from "@/constants/_themeContext";

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
import { CartNumberContext } from "@/constants/shoppingCartNumberContext";

export default function ConcepPr({ categoryFilter }: { categoryFilter: any }) {
  const { setCartNumber } = React.useContext(CartNumberContext);
  const { theme } = useTheme();

  const [produkte, setProdukte] = useState<Product[]>([]);
  const {
    addToFavoriteProduct,
    removeFromFavoriteProducts,
    fetchFavoriteProducts,
    favoriteProducts,
    user,
  } = useAuth();

  useEffect(() => {
    if (!user) {
      console.error("Kein Benutzer angemeldet2");
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

  const loadFilteredProducts = async () => {
    const allProducts = await getProducts();
    const filteredArray = allProducts.filter(
      (prdct) => prdct.categoryId === categoryFilter
    );

    // Favoritenstatus für den aktuellen Benutzer überprüfen
    const updatedProducts = filteredArray.map((product) => ({
      ...product,
      isfavorite: Array.isArray(favoriteProducts)
        ? favoriteProducts.some((fav: { id: number }) => fav.id === product.id)
        : false, // Standardwert, wenn `favoriteProducts` kein Array ist
    }));

    setProdukte(updatedProducts);
  };
  const addToOrder = async (prdID: number) => {
    // Produkt suchen
    const productToAdd: Product | undefined = produkte.find(
      (pr) => pr.id === prdID
    );

    if (!productToAdd) {
      return;
    }

    // Hier wird Order-Datenbank erstellt
    try {
      if (!user) {
        console.error("Kein Benutzer angemeldet3");
        return;
      }

      // Dynamische Referenz auf die Collection 'CurrentOrder{user.uid}'
      const ordersRef = collection(db, `CurrentOrder${user.uid}`);

      // Abfrage: Gibt es bereits ein Produkt mit der gleichen ID?
      const q = query(ordersRef, where("myProduct.id", "==", productToAdd.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Produkt existiert -> Anzahl erhöhen
        const docRef = querySnapshot.docs[0].ref; // Verweis auf das existierende Dokument
        const existingData = querySnapshot.docs[0].data();
        const newAnzahl = (existingData.Anzahl || 0) + 1; // Anzahl um 1 erhöhen

        // Dokument aktualisieren
        await updateDoc(docRef, { Anzahl: newAnzahl });
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
      fetchFavoriteProducts(user.uid);
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
      style={{ backgroundColor: `${theme.backgroundColor}` }}
    >
      {produkte.map((product, index) => (
        <View key={index} className="m-2 mx-4">
          <ProductUi
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
        </View>
      ))}
    </ScrollView>
  );
}
