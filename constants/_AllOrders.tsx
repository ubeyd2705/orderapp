import { SingleOrder } from "@/constants/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";

export const getOrdersBackend = async () => {
  const orderArray: SingleOrder[] = [];
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("Kein Benutzer ist angemeldet.");
    return orderArray;
  }
  const isMitarbeiter = currentUser.email === "Mitarbeiter@hotmail.com";

  let q;
  if (isMitarbeiter) {
    q = query(collection(db, "AllOrders")); // Alle Bestellungen abfragen
  } else {
    q = query(
      collection(db, "AllOrders"),
      where("orderedUser", "==", currentUser.uid) // Nur Bestellungen des aktuellen Benutzers abrufen
    );
  }
  console.log("Render: es wird gelsen");
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    orderArray.push({
      id: doc.data().id,
      order: doc.data().order,
      duration: doc.data().duration,
      isRated: doc.data().isRated,
      isDelivered: doc.data().isDelivered,
      startedPreparing: doc.data().startedPreparing,
      tableNr: doc.data().tableNr,
      orderedUser: doc.data().orderedUser,
      totalPayment: doc.data().totalPayment,
      requestPayment: doc.data().requestPayment,
      isPaid: doc.data().isPaid,
    });
  });

  return orderArray;
};
