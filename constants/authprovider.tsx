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
}

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [vibration, setvibration] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser: React.SetStateAction<FirebaseUser | null>) => {
        setLoading(false);
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            await fetchVibration((firebaseUser as User).uid); // UID des Benutzers verwenden
          } catch (error) {
            console.error("Error during fetching vibration:", error);
          }
        } else {
          setUser(null);
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
        });

        console.log("User document successfully created in Firestore.");
      }

      return newUser; // newUser bleibt erhalten
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error; // Fehler weitergeben, falls benötigt
    }
  };
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
