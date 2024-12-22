import { db } from "@/firebase/firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export async function DeleteDocInCollectionWithId(
  id: number,
  CollectionName: string
) {
  const collectionRef = collection(db, `${CollectionName}`);
  // Query, um das Dokument mit der passenden ID zu finden
  const q = query(collectionRef, where("id", "==", id));
  const querySnapshot = await getDocs(q);
  console.log("Es wird gelöscht");

  // Finden des Dokuments mit dem Titel
  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;

    // Dokument löschen
    await deleteDoc(docRef);
    console.log("es wird gelöscht: Id");
  }
}
