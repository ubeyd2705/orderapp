import { View, Text, Modal, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";

const ConfirmModal = ({
  isActive,
  onClose,
  onConfirm,
}: {
  isActive: boolean;
  onClose: any;
  onConfirm: any;
}) => {
  return (
    <Modal transparent={true} visible={isActive} animationType="fade">
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center visible-false">
        <View className="bg-white w-11/12 max-w-md rounded-lg p-6 ">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Möchten Sie die Bestellung bestätigen ?
          </Text>
          <View className="flex-row justify-end space-x-4">
            <TouchableOpacity
              onPress={onClose}
              className="py-2 px-4 rounded-lg bg-gray-200"
            >
              <Text className="text-gray-800">Abbrechen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="py-2 px-4 rounded-lg bg-blue-500"
            >
              <Text className="text-white">Bestätigen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
