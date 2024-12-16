import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";

const giveRating = () => {
  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View className="h-3/4 bg-white flex justify-between">
          <View className="flex justify-between">
            <Text>Bewertung</Text>
            <TouchableOpacity>
              <Text></Text>
            </TouchableOpacity>
          </View>
          <View className="bg-red-600 flex flex-row justify-end">
            <TouchableOpacity className="m-10 mr-16 mb-16">
              <Text>Senden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default giveRating;
