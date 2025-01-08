import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import StarRating from "./StarRating";
import { Order } from "@/constants/types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { db } from "@/firebase/firebase";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"; // Importiere FileSystem
import { getAuth } from "@firebase/auth";
import { useTheme } from "@/constants/_themeContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const GiveRating = ({
  isVisible,
  close,
  BestellId,
}: {
  isVisible: boolean;
  BestellId: number;
  close: () => void;
}) => {
  const [orderToRate, setOrderToRate] = useState<Order[]>([]);
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [savedImageUri, setSavedImageUri] = useState<string | null>(null);
  const { theme } = useTheme();

  /// Kann es nicht benutzen weil ich kein Firestore storage habe.
  // const uploadImageToFirebase = async (imageUri: string) => {
  //   try {
  //     const storage = getStorage();
  //     const response = await fetch(imageUri);
  //     const blob = await response.blob();

  //     const fileName = imageUri.split("/").pop() || `image_${Date.now()}`;
  //     const storageRef = ref(storage, `images/${fileName}`);

  //     // Bild hochladen
  //     await uploadBytes(storageRef, blob);
  //     console.log("Image uploaded to Firebase Storage");

  //     // URL des gespeicherten Bildes abrufen
  //     const downloadUrl = await getDownloadURL(storageRef);
  //     return downloadUrl; // Diese URL kannst du in der Datenbank speichern
  //   } catch (error) {
  //     console.error("Fehler beim Hochladen des Bildes:", error);
  //     return null;
  //   }
  // };

  const pickImage = async () => {
    // Berechtigungen einholen
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission needed",
        "We need permission to access your media library."
      );
      return;
    }

    // Bild aus der Galerie auswählen
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Zugriff auf die URI des Bildes
      const uri = result.assets[0].uri;
      setImage(uri); // Zugriff auf die URI des ersten Assets// Zugriff auf die URI des ersten Assets
      await saveImageToFile(uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission needed",
        "We need permission to access your camera."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Zugriff auf die URI des Bildes
      const uri = result.assets[0].uri;
      setImage(uri); // Zugriff auf die URI des ersten Assets
      await saveImageToFile(uri);
    }
  };
  const saveImageToFile = async (imageUri: string) => {
    try {
      let fileName = imageUri.split("/").pop(); // Hole den Dateinamen
      if (fileName != null) {
        const path = FileSystem.documentDirectory + fileName;

        // Kopiere das Bild in den neuen Ordner
        await FileSystem.copyAsync({
          from: imageUri,
          to: path,
        });

        // Speicher den Pfad des gespeicherten Bildes
        setSavedImageUri(path);
        Alert.alert("Image Saved", `Image saved to: ${path}`);
      }
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "There was an issue saving the image.");
    }
  };

  const addRatingToCollection = async (
    score: number,
    productTitle: string,
    description: string,
    imageSrc: string | null
  ) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      let name = "";
      if (user?.displayName != null) {
        name = user?.displayName;
      }

      const ratingsRef = collection(db, "rating");

      await addDoc(ratingsRef, {
        score,
        productTitle,
        description,
        name: name,
        imageSrc,
        // Zeitstempel hinzufügen
      });
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Bewertung:", error);
    }
  };

  const confirmRatingButton = async (
    title: string,
    score: number,
    description: string,
    imageSrc: string | null
  ) => {
    try {
      // Bestehende Firebase-Update-Logik
      const collectionRef = collection(db, "products");
      const q = query(collectionRef, where("title", "==", title));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("Kein Dokument mit dem angegebenen Titel gefunden.");
        return;
      }

      const docToUpdate = querySnapshot.docs[0];
      const docRef = doc(db, "products", docToUpdate.id);

      const currentData = docToUpdate.data();
      const currentAmountOfGivenRatings = currentData.amountOfGivenRatings || 0;
      const currentRatingScoreInTotal = currentData.ratingScoreInTotal || 0;

      const updatedRatingScoreInTotal = currentRatingScoreInTotal + score;
      const updatedAmountOfGivenRatings = currentAmountOfGivenRatings + 1;
      const updatedRatingScore =
        updatedRatingScoreInTotal / updatedAmountOfGivenRatings;

      await updateDoc(docRef, {
        RatingScore: updatedRatingScore,
        amountOfGivenRatings: updatedAmountOfGivenRatings,
        ratingScoreInTotal: updatedRatingScoreInTotal,
      });

      // Hier die Bewertung in die Collection `ratings` hinzufügen
      await addRatingToCollection(score, title, description, imageSrc);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Ratings:", error);
    }
  };
  const setIsRatedtrue = async (id: number) => {
    try {
      // Erstelle eine Abfrage, um das Dokument mit dem benutzerdefinierten `id`-Attribut zu finden
      const ordersRef = collection(db, "AllOrders");
      const q = query(ordersRef, where("id", "==", id)); // Suche nach Dokumenten mit der benutzerdefinierten `id`

      // Hole die Dokumente, die dem Suchkriterium entsprechen
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Es gibt ein Dokument, das die ID übereinstimmt
        const orderDoc = querySnapshot.docs[0]; // Wir nehmen das erste (und vermutlich einzige) Dokument
        const orderRef = doc(db, "AllOrders", orderDoc.id); // Hole die Referenz des Dokuments anhand der Firebase-Dokument-ID

        // Aktualisiere das Attribut "isRated" auf true
        await updateDoc(orderRef, {
          isRated: true,
        });

        console.log(
          `Dokument mit benutzerdefinierter ID ${id} erfolgreich aktualisiert.`
        );
      } else {
        console.log(
          `Kein Dokument mit der benutzerdefinierten ID ${id} gefunden.`
        );
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Attributs isRated:", error);
    }
  };
  const loadAllOrdersWithIdFromBackend = async () => {
    try {
      const collectionRef = collection(db, `myOrders${BestellId}`);
      const querySnapshot = await getDocs(collectionRef);

      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({
          pr: doc.data().myProduct,
          quantity: doc.data().Anzahl,
          id: doc.id,
        });
      });
      setOrderToRate(orders);
    } catch (error) {
      console.error("Fehler beim Laden der Bestellungen:", error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadAllOrdersWithIdFromBackend();
    }
    setIndex(0);
    console.log(savedImageUri);
  }, [isVisible]);

  const handleNextProduct = () => {
    if (index < orderToRate.length - 1) {
      // Weiter zum nächsten Produkt
      setIndex(index + 1);
      setSavedImageUri(null);
    } else {
      // Letztes Produkt erreicht, Modal schließen
      setSavedImageUri(null);
      setIsRatedtrue(BestellId);
      close();
    }

    // Zurücksetzen der Felder
    setRatingScore(0);
    setComment("");
  };
  const deleteUploadedPhoto = () => {
    setSavedImageUri(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Modal visible={isVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={close}>
          <View className="flex-1 justify-end  bg-opacity-50">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                className="h-3/5  rounded-t-3xl p-4"
                style={{ backgroundColor: `${theme.backgroundColor}` }}
              >
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <View className="flex items-center">
                    {/* Navigation zwischen Bestellungen */}
                    <View className="flex flex-row items-center justify-between w-full px-8">
                      <TouchableOpacity
                        onPress={() =>
                          setIndex((prev) => Math.max(prev - 1, 0))
                        }
                      >
                        <FontAwesome
                          name="step-backward"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                      <Text className="text-lg font-semibold">
                        {orderToRate.length > 0
                          ? `${index + 1}/${orderToRate.length}`
                          : "0/0"}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setIndex((prev) =>
                            Math.min(prev + 1, orderToRate.length - 1)
                          )
                        }
                      >
                        <FontAwesome
                          name="step-forward"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Produktbewertung */}
                    <View className="mt-4 w-full px-8">
                      {orderToRate.length > 0 ? (
                        <StarRating
                          title={orderToRate[index]?.pr?.title || "Produkt"}
                          setRating={setRatingScore}
                          rating={ratingScore}
                        />
                      ) : (
                        <Text className="text-center text-gray-500">
                          Keine Bestellungen gefunden.
                        </Text>
                      )}
                    </View>

                    {/* Kommentar */}
                    <View className="mt-4 w-full px-8">
                      <TextInput
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        numberOfLines={4}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`border p-3 rounded-lg ${
                          isFocused ? "border-blue-500" : "border-gray-300"
                        }`}
                        placeholder="Schreiben Sie Ihren Kommentar hier..."
                        style={{ color: `${theme.textColor}` }}
                      />
                    </View>
                    <View>
                      {savedImageUri ? (
                        <View className="border-hairline  h-40 w-40 rounded mt-10 flex items-center justify-center">
                          <TouchableOpacity onPress={deleteUploadedPhoto}>
                            <Image
                              source={{ uri: savedImageUri }}
                              style={{ width: 160, height: 160 }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className=" border-hairline  h-40 w-40 rounded mt-10 flex items-center justify-center">
                          <Text style={{ color: `${theme.textColor}` }}>
                            Bild hinzufügen
                          </Text>
                          <View className="flex flex-row m-1">
                            <TouchableOpacity
                              onPress={pickImage}
                              className="m-1 bg-blue-500 p-1 rounded-sm"
                            >
                              <Text className="text-xs">Galerie</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={takePhoto}
                              className="m-1 bg-blue-500 p-1 rounded-sm"
                            >
                              <Text className="text-xs">aufnehmen</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </ScrollView>

                {/* Senden-Button */}
                <View className="flex items-end px-8">
                  <TouchableOpacity
                    className="m-10 bg-blue-500 p-4 mr-5 rounded-lg"
                    onPress={async () => {
                      await confirmRatingButton(
                        orderToRate[index]?.pr?.title,
                        ratingScore,
                        comment,
                        savedImageUri
                      );
                      handleNextProduct();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white font-semibold">
                      Bewertung abgeben
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default GiveRating;
