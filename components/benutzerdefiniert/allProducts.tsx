import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import ProductUi from "./Single-Pr";
import { Product } from "@/constants/types";
import { getProducts } from "@/constants/_products";
import { useAuth } from "@/constants/authprovider";

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
import { useTheme } from "@/constants/_themeContext";
/**
 * Die `allProducts`-Komponente zeigt eine Liste von Produkten basierend auf der ausgewählten Kategorie.
 * Sie ermöglicht es, Produkte zu favorisieren, und zeigt den Einkaufswagen-Zähler an.
 *
 * @param {Object} props - Die Requisiten für die Komponente.
 * @param {any} props.categoryFilter - Der Filter für die Produktkategorie.
 * @returns {JSX.Element} Die Ansicht für die Produktübersicht.
 */

export default function AllProducts({
  categoryFilter,
}: {
  categoryFilter: any;
}) {
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

    fetchFavoriteProducts(user.uid);

    // Listener für die Collection `CurrentOrder${user.uid}`
    const q = query(collection(db, `CurrentOrder${user.uid}`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let totalQuantity = 0;

      // Summiere alle Werte des Attributs "Anzahl"
      querySnapshot.forEach((doc) => {
        totalQuantity += doc.data().Anzahl;
      });

      // Aktualisiere den Einkaufswagen-Zähler im globalen Zustand
      setCartNumber(totalQuantity);
    });

    return () => unsubscribe();
  }, [user]);

  /**
   * Lädt die Produkte basierend auf dem angewendeten Kategoriefilter und fügt ein Attribut isfavorite hinzu und wird gesetzt.
   *
   * @async
   */

  const loadFilteredProducts = async () => {
    const allProducts = await getProducts();
    const filteredArray = allProducts.filter(
      (prdct) => prdct.categoryId === categoryFilter
    );

    const updatedProducts = filteredArray.map((product) => ({
      ...product,
      isfavorite: Array.isArray(favoriteProducts)
        ? favoriteProducts.some((fav: { id: number }) => fav.id === product.id)
        : false, // Standardwert, wenn `favoriteProducts` kein Array ist
    }));

    setProdukte(updatedProducts);
  };

  /**
   * Fügt ein Produkt zur Bestellung hinzu. Wenn das Produkt bereits vorhanden ist, wird die Anzahl erhöht.
   *
   * @async
   * @param {number} prdID - Die ID des Produkts.
   * @param {string} note - Eine Notiz zu diesem Produkt für extra details in der Bestellung.
   */
  const addToOrder = async (prdID: number, note: string) => {
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

      const ordersRef = collection(db, `CurrentOrder${user.uid}`);

      // Abfrage: Gibt es bereits ein Produkt mit der gleichen ID?
      const q = query(ordersRef, where("myProduct.id", "==", productToAdd.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Produkt existiert -> Anzahl erhöhen
        const docRef = querySnapshot.docs[0].ref; // Verweis auf das existierende Dokument
        const existingData = querySnapshot.docs[0].data();
        const newAnzahl = (existingData.Anzahl || 0) + 1; // Anzahl um 1 erhöhen
        const newNote = (existingData.note || "") + ` ${note}`;

        // Dokument aktualisieren
        await updateDoc(docRef, { Anzahl: newAnzahl, note: newNote });
      } else {
        // Produkt existiert nicht -> Neues Dokument erstellen
        await addDoc(ordersRef, {
          myProduct: productToAdd,
          Anzahl: 1,
          note: note,
        });
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern der Bestellung.");
    }
  };

  // Lade die Produkte, wenn sich die Kategorie oder die Favoriten ändern

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
