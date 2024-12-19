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
import { auth } from "../firebase/firebase";
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
}

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (firebaseUser: React.SetStateAction<FirebaseUser | null>) => {
        setLoading(false);
        if (firebaseUser) {
          setUser(firebaseUser);
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
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    if (newUser.user) {
      await updateProfile(newUser.user, {
        displayName: `${firstName} ${lastName}`,
      });
      setUser({ ...newUser.user, displayName: `${firstName} ${lastName}` });
    }

    return newUser;
  };

  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{ loading, user, login, logout, signup, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}
