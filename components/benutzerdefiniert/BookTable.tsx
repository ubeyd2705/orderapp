import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  getTables,
  getAllBookedTimesOfATable,
} from "./../../chelpfullfunctions/getAllTables";
import { table } from "@/constants/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/constants/authprovider";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
const BookTable = () => {
  const router = useRouter();
  const { user, updateChosenTableNumber, updateHasChosen, updatechosenTime } =
    useAuth();
  const amountOfGuests = [1, 2, 3, 4, 5, 6];
  const times = ["jetzt", "13:00", "14:00", "15:00", "16:00", "17:00"];
  // Lokal tableArray zum Speichern und Anzeigen
  const [localTables, setLocalTables] = useState<table[]>([]);
  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(
    null
  );
  const [firstName, setfirstName] = useState<string>("");
  const [lastName, setlastName] = useState<string>("");
  const [selectedAmountOfGuest, setSelectedAmountOfGuest] = useState<number>();
  const [selectedTime, setSelectedTime] = useState<string | null>();
  const [allBookedTimesofATableNumber, setallBookedTimesofATableNumber] =
    useState<string[]>([]);
  // Speichert die gedrückte Tischnummer
  const colorScheme = useColorScheme();

  // Tables aus der Datenbank werden geladen und lokal gespeichert
  const loadTables = async () => {
    try {
      const tables = await getTables();
      setLocalTables(tables);
    } catch (error) {
      console.error("Fehler beim Laden der Tabellen:", error);
    }
  };

  const booktable = async () => {
    if (selectedTableNumber && selectedTime) {
      updateChosenTableNumber(selectedTableNumber);
      updatechosenTime(selectedTime);
      updateHasChosen(true);
    }

    try {
      // Referenz zur Collection "tables"
      const tablesCollection = collection(db, "tables");

      // Query, um das Dokument mit der gegebenen tableNumber zu finden
      const q = query(
        tablesCollection,
        where("number", "==", selectedTableNumber)
      );

      // Abrufen der Dokumente, die der Query entsprechen
      const snapshot = await getDocs(q);

      // Überprüfen, ob das Dokument existiert
      if (snapshot.empty) {
        console.error("Tabelle nicht gefunden");
        return;
      }

      // Referenz zum ersten Dokument (wir gehen davon aus, dass tableNumber eindeutig ist)
      const tableDoc = snapshot.docs[0];
      const tableRef = doc(db, "tables", tableDoc.id);

      // Bestehende Daten aus dem Dokument
      const tableData = tableDoc.data();
      const existingBookedTimes = tableData.isBooked || [];

      // Neues Zeitfenster hinzufügen, falls es noch nicht existiert
      if (!existingBookedTimes.includes(selectedTime)) {
        existingBookedTimes.push(selectedTime);
      }

      // Dokument aktualisieren
      await updateDoc(tableRef, {
        isBooked: existingBookedTimes,
        isBookedBy: `${firstName} ${lastName}`, // Benutzername setzen
      });

      console.log("Tisch erfolgreich gebucht!");
      Toast.show({
        type: "success",
        text1: `Tisch ${selectedTableNumber} ausgewählt`,
      });
      router.push("/(tabs)");
    } catch (error) {
      console.error("Fehler beim Buchen des Tisches: ", error);
    }
  };

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (selectedTableNumber) {
        const allTimes = await getAllBookedTimesOfATable(selectedTableNumber);
        setallBookedTimesofATableNumber(allTimes); // Setzen des string[] Arrays im State
      }
    };

    fetchBookedTimes();
    console.log(allBookedTimesofATableNumber);
    console.log(selectedTableNumber);
  }, [selectedTableNumber]);
  const loadNames = () => {
    const names = user?.displayName?.split(" ");
    const firstName = names ? names[0] : "";
    const lastName = names ? names[1] : "";
    setfirstName(firstName);
    setlastName(lastName);
  };

  useEffect(() => {
    loadNames();
    loadTables();
    const unsubscribe = onSnapshot(
      collection(db, "tables"), // Die Collection, die überwacht wird
      (snapshot) => {
        const tables = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as table[];
        setLocalTables(tables); // Aktualisiert den State mit den neuen Daten
      },
      (error) => {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    );

    // Cleanup-Funktion, um den Listener zu entfernen, wenn der Component unmountet
    return () => unsubscribe();
  }, []);

  return (
    <View className="m-3">
      <Text
        className="text-lg font-bold "
        style={{ color: `${Colors[colorScheme ?? "light"].text2}` }}
      >
        Tische
      </Text>
      <View className="flex-row flex-wrap justify-center">
        {localTables.map((table, index) => (
          <TouchableOpacity
            key={index}
            className={`w-16 h-8 m-2 border rounded-lg justify-center items-center`}
            style={{
              backgroundColor: `${
                selectedTableNumber === table.number
                  ? "#0369A1"
                  : Colors[colorScheme ?? "light"].background
              }`,
            }}
            onPress={() => setSelectedTableNumber(table.number)}
          >
            <Text
              className="font-bold"
              style={{
                color: `${
                  selectedTableNumber === table.number
                    ? Colors[colorScheme ?? "light"].background
                    : Colors[colorScheme ?? "light"].text
                }`,
              }}
            >
              {table.number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text
        className="text-lg font-bold "
        style={{ color: `${Colors[colorScheme ?? "light"].text2}` }}
      >
        Anzahl der Personen
      </Text>
      <View className="flex-row">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {amountOfGuests.map((amount, index) => (
            <TouchableOpacity
              key={index}
              className={`w-16 h-8 m-2 border rounded-lg justify-center items-center`}
              style={{
                backgroundColor: `${
                  selectedAmountOfGuest === amount
                    ? "#0369A1"
                    : Colors[colorScheme ?? "light"].background
                }`,
              }}
              onPress={() => setSelectedAmountOfGuest(amount)}
            >
              <Text
                className="font-bold"
                style={{
                  color: `${
                    selectedAmountOfGuest === amount
                      ? Colors[colorScheme ?? "light"].background
                      : Colors[colorScheme ?? "light"].text
                  }`,
                }}
              >
                {amount}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Text
        className="text-lg font-bold "
        style={{ color: `${Colors[colorScheme ?? "light"].text2}` }}
      >
        Uhrzeiten
      </Text>
      <View className="flex-row ">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {times.map((time, index) => (
            <TouchableOpacity
              key={index}
              className={`w-16 h-8 m-2 border rounded-lg justify-center items-center`}
              style={{
                backgroundColor: `${
                  allBookedTimesofATableNumber.some((item) =>
                    item.includes(time)
                  )
                    ? "#4A5568"
                    : selectedTime === time
                    ? "#0369A1"
                    : Colors[colorScheme ?? "light"].background
                }`,
              }}
              disabled={allBookedTimesofATableNumber.some((item) =>
                item.includes(time)
              )}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                className="font-bold"
                style={{
                  color: `${
                    selectedTime === time
                      ? Colors[colorScheme ?? "light"].background
                      : Colors[colorScheme ?? "light"].text
                  }`,
                }}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View className=" justify-center items-center pl-4 pr-4 md:h-80 h-16 md:mb-60  p-2 pb-0">
        <TouchableOpacity
          className="w-full justify-center items-center mr-4 ml-4 bg-sky-700 rounded-2xl h-full mt-11"
          activeOpacity={0.7}
          onPress={booktable}
          disabled={
            !selectedTime || !selectedAmountOfGuest || !selectedTableNumber
          }
        >
          <Text className="text-lg text-white font-medium">Bestätigen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookTable;
