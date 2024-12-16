import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SingleOrder } from "@/constants/types";
import { collection, deleteDoc, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { DeleteDocInCollectionWithId } from "@/chelpfullfunctions/b_DeletDocInCollection";
import ProgressBar from "./Progress";
import { useRouter } from "expo-router";

export default function Test({
  BestellId,
  AllOrders,
}: {
  BestellId: number;
  AllOrders: SingleOrder[];
}) {
  async function deleteDocumentButton(id: number) {
    DeleteDocInCollectionWithId(id, "AllOrders");

    //Alle Werte in der Sammlung löschen
    const collectionRef2 = collection(db, `myOrders${id}`);
    const q2 = query(collectionRef2);
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach(async (doc2) => {
      await deleteDoc(doc2.ref);
      console.log("Alle Daten sollten gelöscht werden");
    });
  }
  return (
    <View className="flex justify-center items-center  p-4">
      {AllOrders.map((order) => (
        <View className="flex justify-center items-center  w-full ">
          <View className="bg-white flex justify-between w-full h-24  rounded-md mb-0 m-5">
            <View className="h-4/6 flex justify-center items-center">
              <Text className="text-xl font-semibold ">
                {AllOrders.length == 0
                  ? "Noch keine Bestellung"
                  : `Bestellung: ${order.id + 1}`}
              </Text>
            </View>

            <View className="h-2/6 flex flex-row justify-between">
              <TouchableOpacity
                className="w-1/3 justify-center items-center border-t  border-gray-200"
                activeOpacity={0.7}
                onPress={() => deleteDocumentButton(order.id)}
              >
                <Text className="text-sky-700">stonieren</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-1/3 justify-center items-center border-t border-l border-gray-200 "
                activeOpacity={0.7}
              >
                <Text className="text-sky-700 ">Bewerten</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-1/3 justify-center items-center border-t border-l border-gray-200 "
                activeOpacity={0.7}
              >
                <Text className="text-sky-700">Bezahlen</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="h-26 w-full justify-center items-center">
            <ProgressBar maxSteps={order.duration * 10}></ProgressBar>
          </View>
        </View>
      ))}
    </View>
  );
}
