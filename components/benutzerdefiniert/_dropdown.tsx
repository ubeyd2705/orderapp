import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/constants/authprovider";
import { deleteBookedTable } from "@/chelpfullfunctions/getAllTables";
import { DeleteDocsInCollectionWithUserId } from "./../../chelpfullfunctions/b_DeletDocInCollection";

export default function DropdownMenu() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const {
    user,
    fetchchosenTime,
    fetchChosenTableNumber,
    fetchHasChosen,
    localHasChosen,
    chosenTableNumber,
    chosenTime,
    updateHasChosen,
    updatechosenTime,
    updateChosenTableNumber,
  } = useAuth();

  useEffect(() => {
    if (user) {
      fetchChosenTableNumber(user.uid);
      fetchHasChosen(user.uid);
      fetchchosenTime(user.uid);
    }
  }, []);
  const toggleModal = () => setModalVisible(!isModalVisible);
  const handleCancel = () => {
    if (chosenTime === "jetzt") {
      Alert.alert(
        "Stornieren nicht möglich",
        "Der Tisch kann nicht storniert werden."
      );
    } else {
      // Hier Logik für die Stornierung hinzufügen
      if (chosenTableNumber && chosenTime && user) {
        deleteBookedTable(chosenTableNumber, chosenTime);
        DeleteDocsInCollectionWithUserId(user.uid, "AllOrders", "orderedUser");
        updateChosenTableNumber(0);
        updatechosenTime("");
        updateHasChosen(false);
      }
      Alert.alert("Storniert", "Ihre Buchung wurde storniert.");
      setModalVisible(false);
    }
  };

  return (
    <View className="flex items-center justify-center ">
      <TouchableOpacity
        className="flex flex-row items-center px-4 py-2 rounded-lg shadow-md"
        onPress={() => {
          if (localHasChosen) {
            toggleModal();
          } else if (user?.email === "gast@hotmail.com") {
            router.push("/signUp");
          } else {
            router.push("/chooseOfTable");
          }
        }}
        style={{
          backgroundColor: `${Colors[colorScheme ?? "light"].background2}`,
        }}
      >
        <Text
          className="text-base mr-2"
          style={{
            color: `${Colors[colorScheme ?? "light"].text3}`,
          }}
        >
          {localHasChosen ? `Tisch: ${chosenTableNumber}` : "Tisch wählen"}
        </Text>
      </TouchableOpacity>
      <Text
        className="text-base mr-2"
        style={{
          color: `${Colors[colorScheme ?? "light"].text3}`,
        }}
      ></Text>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: Colors[colorScheme ?? "light"].background },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              Ihre Buchung
            </Text>
            <Text
              style={[
                styles.modalText,
                { color: Colors[colorScheme ?? "light"].text3 },
              ]}
            >
              Zeit: {chosenTime}
            </Text>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor:
                    chosenTime === "jetzt" ? "#cccccc" : "#f44336",
                },
              ]}
              onPress={handleCancel}
              disabled={chosenTime === "jetzt"}
            >
              <Text style={styles.cancelButtonText}>Stornieren</Text>
            </TouchableOpacity>
            <Pressable style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
