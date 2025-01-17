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
export async function DeleteDocsInCollectionWithUserId(
  userid: string,
  CollectionName: string,
  userAttributeInCollection: string
): Promise<void> {
  try {
    const collectionRef = collection(db, `${CollectionName}`);
    // Query, um alle Dokumente mit der passenden userid zu finden
    const q = query(
      collectionRef,
      where(`${userAttributeInCollection}`, "==", userid)
    );
    const querySnapshot = await getDocs(q);

    console.log(`Anzahl der zu löschenden Dokumente: ${querySnapshot.size}`);

    // Iteriere über alle gefundenen Dokumente und lösche sie
    const deletePromises = querySnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`Dokument mit ID ${doc.id} gelöscht.`);
    });

    // Warten, bis alle Löschvorgänge abgeschlossen sind
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Fehler beim Löschen der Dokumente: ", error);
    throw new Error("Fehler beim Löschen der Dokumente.");
  }
}
