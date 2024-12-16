// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3sQGdk26qDTmWHYNwQM_F7bsE2oFaR-U",
  authDomain: "orderapp-1e7af.firebaseapp.com",
  projectId: "orderapp-1e7af",
  storageBucket: "orderapp-1e7af.firebasestorage.app",
  messagingSenderId: "365905946530",
  appId: "1:365905946530:web:1e4188217797418572b4fb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth: any;
if (Platform.OS === "web") {
  // Für Web verwenden wir einfach initializeAuth ohne Persistenz
  auth = getAuth(app);
} else {
  // Für React Native verwenden wir getReactNativePersistence mit AsyncStorage
  const { getReactNativePersistence } = require("firebase/auth");
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage), // Persistenz für React Native
  });
}
export const db = getFirestore(app);
export { auth };
