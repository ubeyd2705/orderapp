import { useContext, useEffect, useState } from "react";

import {
  signInWithEmailAndPassword,
  type User as FirebaseUser,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { Product } from "./types";
import { useRouter } from "expo-router";

interface IAuthContext {
  user: User | null;
  login(email: string, password: string): Promise<UserCredential>;
  logout(): void;
  signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<UserCredential>;
  resetPassword(email: string): Promise<void>;
  loading: boolean;
  updateUserProfile(firstName: string, lastName: string): Promise<void>;
  vibrationUpdater(vibration: boolean): Promise<void>;
  vibration: boolean;
  fetchVibration(uid: string): Promise<void>;
  addToFavoriteProduct(product: Product): Promise<void>;
  fetchFavoriteProducts(): Promise<void>;
  removeFromFavoriteProducts(productId: string): Promise<void>;
  favoriteProducts: Product[];
  loyaltyPoints: number | undefined;
  resetLoyaltyPoints(): Promise<void>;
  fetchLoyaltyPoints(uid: string): Promise<void>;
  addLoyaltyPoints(points: number): Promise<void>;
  gifts: number | undefined;
  updateGifts(addOrRemove: boolean): Promise<void>;
  fetchGifts(uid: string): Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [vibration, setvibration] = useState(true);
  const [favoriteProducts, setfavoriteProducts] = useState<Product[]>([]);
  const [loyaltyPoints, setloyaltyPoints] = useState<number>();
  const [gifts, setGifts] = useState<number>();

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser: React.SetStateAction<FirebaseUser | null>) => {
        setLoading(false);
        if (firebaseUser) {
          setUser(firebaseUser);
          setfavoriteProducts([]);
          if (user?.email != "mitarbeiter@hotmail.com") {
            router.push("/(tabs)");
          } else {
            router.push("./(stuffTabs)");
          }

          try {
            await fetchVibration((firebaseUser as User).uid); // UID des Benutzers verwenden
            console.log("es passiert was");
            await fetchFavoriteProducts();
            await fetchGifts((firebaseUser as User).uid);
            await fetchLoyaltyPoints((firebaseUser as User).uid);
          } catch (error) {
            console.error("Error during fetching vibration:", error);
          }
        } else {
          setUser(null);
          setfavoriteProducts([]); // Zustand bei Abmeldung leeren
        }
      }
    );

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };
  const updateUserProfile = async (firstName: string, lastName: string) => {
    if (user) {
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
      setUser({ ...user, displayName: `${firstName} ${lastName}` });
      await updateDoc(doc(db, "user", user.uid), {
        firstName,
        lastName,
      });
    }
  };

  const logout = () => {
    setUser(null);
    void signOut(auth);
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      // Benutzer erstellen
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (newUser.user) {
        // Profil des Benutzers aktualisieren
        await updateProfile(newUser.user, {
          displayName: `${firstName} ${lastName}`,
        });

        // Benutzer im Zustand setzen
        setUser({ ...newUser.user, displayName: `${firstName} ${lastName}` });

        // Dokument in der Firestore-Collection erstellen
        await setDoc(doc(db, "user", newUser.user.uid), {
          firstName,
          lastName,
          vibration: true, // Standardwert
          darkmode: false, // Standardwert
          role: "Kunde",
          loyaltyPoints: 0,
          gifts: 0,
        });

        console.log("User document successfully created in Firestore.");
      }

      return newUser; // newUser bleibt erhalten
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error; // Fehler weitergeben, falls benötigt
    }
  };
  useEffect(() => {
    console.log("Aktueller Benutzer:", user);
    if (user) {
      fetchFavoriteProducts();
    }
  }, [user]);
  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };
  const vibrationUpdater = async (vibration: boolean) => {
    if (user) {
      try {
        await updateDoc(doc(db, "user", user.uid), {
          vibration,
        });
        setvibration(vibration); // Zustand lokal aktualisieren
        console.log(`Vibration erfolgreich auf ${vibration} gesetzt`);
      } catch (error) {
        console.error("Fehler beim Aktualisieren der Vibration:", error);
        throw error;
      }
    } else {
      console.error("Kein Benutzer angemeldet.");
    }
  };
  const addToFavoriteProduct = async (product: Product) => {
    if (user) {
      try {
        const userRef = doc(db, "user", user.uid);

        const userDoc = await getDoc(userRef);
        const currentFavorites = userDoc.exists()
          ? userDoc.data()?.favoriteProducts || []
          : [];

        const updatedFavorites = [
          ...currentFavorites.filter((p: Product) => p.id !== product.id),
          product,
        ];

        await updateDoc(userRef, {
          favoriteProducts: updatedFavorites,
        });

        setfavoriteProducts(updatedFavorites);
        console.log(`Produkt zu Favoriten hinzugefügt: ${product.title}`);
      } catch (error) {
        console.error("Fehler beim Hinzufügen zu Favoriten:", error);
      }
    } else {
      console.error("Kein Benutzer angemeldet.");
    }
  };

  const fetchVibration = async (uid: string) => {
    try {
      const userRef = doc(db, "user", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data?.vibration !== undefined) {
          setvibration(data.vibration); // Den Wert aus der Datenbank verwenden
        } else {
          console.error(
            "Vibration property is not found in the user document."
          );
        }
      } else {
        // Dokument erstellen, wenn es nicht existiert
        console.log("User document does not exist. Creating a new document.");
        await setDoc(userRef, {
          firstName: "", // Leerer Platzhalter oder Standardwert
          lastName: "", // Leerer Platzhalter oder Standardwert
          vibration: true,
          darkmode: false,
        });
        setvibration(true); // Standardwert setzen
      }
    } catch (error) {
      console.error("Error fetching or creating user document:", error);
      throw error;
    }
  };
  const fetchGifts = async (uid: string) => {
    try {
      const userRef = doc(db, "user", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data?.gifts !== undefined) {
          setGifts(data.gifts); // Den Wert aus der Datenbank verwenden
        } else {
          console.error("gifts property is not found in the user document.");
        }
      } else {
        // Dokument erstellen, wenn es nicht existiert
        console.log("User document does not exist. Creating a new document.");
        await setDoc(userRef, {
          gifts: 0,
        });
        setGifts(0); // Standardwert setzen
      }
    } catch (error) {
      console.error("Error fetching or creating user document:", error);
      throw error;
    }
  };
  const updateGifts = async (addOrRemove: boolean) => {
    if (user) {
      try {
        const userRef = doc(db, "user", user.uid);

        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const currentGifts = userDoc.data()?.gifts || 0;
          const updatedGifts = addOrRemove
            ? currentGifts + 1
            : Math.max(0, currentGifts - 1);

          await updateDoc(userRef, {
            gifts: updatedGifts,
          });

          console.log(`Geschenke aktualisiert: ${updatedGifts}`);
        } else {
          console.error("Benutzerdokument existiert nicht.");
        }
      } catch (error) {
        console.error("Fehler beim Aktualisieren der Geschenke:", error);
      }
    } else {
      console.error("Kein Benutzer angemeldet.");
    }
  };

  const resetLoyaltyPoints = async () => {
    if (user) {
      try {
        const userRef = doc(db, "user", user.uid);

        // Treuepunkte in der Datenbank auf 0 setzen
        await updateDoc(userRef, {
          loyaltyPoints: 0,
        });

        // Lokale Anzeige der Treuepunkte aktualisieren
        setloyaltyPoints(0); // setLoyaltyPoints ist ein Zustand (state) für die Punkteanzeige

        console.log("Treuepunkte wurden erfolgreich zurückgesetzt.");
      } catch (error) {
        console.error("Fehler beim Zurücksetzen der Treuepunkte:", error);
      }
    } else {
      console.error("Kein Benutzer angemeldet.");
    }
  };

  const addLoyaltyPoints = async (points: number) => {
    if (user) {
      try {
        const userRef = doc(db, "user", user.uid);

        // Aktuelles Dokument abrufen
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const currentLoyaltyPoints = userDoc.data()?.loyaltyPoints || 0;
          const newLoyaltyPoints = currentLoyaltyPoints + points;

          // Treuepunkte aktualisieren
          await updateDoc(userRef, {
            loyaltyPoints: newLoyaltyPoints,
          });
          setloyaltyPoints(newLoyaltyPoints);

          console.log(`Treuepunkte aktualisiert: ${newLoyaltyPoints} Punkte.`);
        } else {
          console.error("Benutzerdokument existiert nicht.");
        }
      } catch (error) {
        console.error("Fehler beim Hinzufügen von Treuepunkten:", error);
      }
    } else {
      console.error("Kein Benutzer angemeldet.");
    }
  };

  const fetchLoyaltyPoints = async (uid: string) => {
    try {
      const userRef = doc(db, "user", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data?.loyaltyPoints !== undefined) {
          setloyaltyPoints(data.loyaltyPoints); // Den Wert aus der Datenbank verwenden
        } else {
          console.error("Loyalty property is not found in the user document.");
        }
      } else {
        // Dokument erstellen, wenn es nicht existiert
        console.log("User document does not exist. Creating a new document.");
        await setDoc(userRef, {
          loyaltyPoints: 0,
        });
        setloyaltyPoints(0); // Standardwert setzen
      }
    } catch (error) {
      console.error("Error fetching or creating user document:", error);
      throw error;
    }
  };

  const removeFromFavoriteProducts = async (productId: string) => {
    if (user) {
      try {
        // Referenz zum Benutzerdokument in Firestore
        const userRef = doc(db, "user", user.uid);

        // Aktuelle Favoriten aus der Datenbank abrufen
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          console.error("Fehler: Benutzerdokument existiert nicht.");
          return; // Abbrechen, da kein Dokument existiert
        }

        const currentFavorites = userDoc.data()?.favoriteProducts || [];

        // Das Produkt mit der gegebenen ID entfernen
        const updatedFavorites = currentFavorites.filter(
          (p: Product) => Number(p.id) !== Number(productId)
        );

        // Favoritenliste aktualisieren
        await updateDoc(userRef, {
          favoriteProducts: updatedFavorites,
        });

        // Attribut `isFavorite` des Produkts in der Collection "products" auf `false` setzen
        const productRef = doc(db, "products", productId);

        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          await updateDoc(productRef, {
            isFavorite: false,
          });
        } else {
          console.log(
            `Produkt mit ID ${productId} existiert nicht in 'products'.`
          );
        }

        // Lokalen Zustand aktualisieren
        setfavoriteProducts(updatedFavorites);
        console.log(`Produkt erfolgreich entfernt: ${productId}`);
      } catch (error) {
        console.error("Fehler beim Entfernen von Favoriten:", error);
        throw error;
      }
    } else {
      console.error("Kein Benutzer angemeldet.");
    }
  };
  const fetchFavoriteProducts = async () => {
    if (user) {
      try {
        // Referenz auf das Benutzerdokument
        const userRef = doc(db, "user", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Favoritenliste aus dem Benutzerdokument abrufen
          const favoriteProducts = userDoc.data()?.favoriteProducts || [];

          // Lokalen Zustand mit den Favoriten aktualisieren
          setfavoriteProducts(favoriteProducts);

          console.log(favoriteProducts);
        } else {
          console.log("Benutzerdokument existiert nicht.");
          setfavoriteProducts([]); // Zustand auf leere Liste setzen, wenn keine Favoriten existieren
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Favoriten:", error);
        throw error;
      }
    } else {
      console.error("Kein Benutzer angemeldet.");
      setfavoriteProducts([]); // Zustand auf leere Liste setzen, wenn kein Benutzer angemeldet ist
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        login,
        logout,
        signup,
        resetPassword,
        updateUserProfile,
        vibrationUpdater,
        vibration,
        fetchVibration,
        addToFavoriteProduct,
        fetchFavoriteProducts,
        removeFromFavoriteProducts,
        favoriteProducts,
        loyaltyPoints,
        resetLoyaltyPoints,
        fetchLoyaltyPoints,
        addLoyaltyPoints,
        gifts,
        updateGifts,
        fetchGifts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
