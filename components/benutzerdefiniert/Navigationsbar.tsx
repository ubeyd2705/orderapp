import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { categories } from "../../constants/data";
import { useColorScheme } from "nativewind";
import { ScrollView } from "react-native";
import { db } from "@/firebase/firebase";
import { Category } from "@/constants/types";
import { collection, getDocs, query } from "firebase/firestore";

const NavigationBar = ({ isSelect }: { isSelect: any }) => {
  const { colorScheme } = useColorScheme();
  const [kategorien, setKategorien] = useState<Category[]>([]);
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const categoryArray: Category[] = [];
    const q = query(collection(db, "categories"));
    const querySnapshot = await getDocs(q);
    console.log("Quoteeeeeeeeeeeee");
    querySnapshot.forEach((doc) => {
      categoryArray.push({
        id: doc.data().id,
        title: doc.data().title,
      });
    });
    const sortedArray = categoryArray.sort((a, b) => a.id.localeCompare(b.id));
    setKategorien(sortedArray);
  };

  return (
    <View className="flex flex-row mx-auto ">
      <ScrollView horizontal contentContainerStyle={styles.contentContainer}>
        {kategorien.map((cat) => (
          <TouchableOpacity
            className="flex-1 items-center justify-center p-4 md:min-w-60 rounded-md bg-gray-100 active:bg-sky-700 m-1 "
            onPress={() => isSelect(cat.title)}
          >
            <Text className={` md:text-4xl text-lg text-center`}>
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    padding: 16, // Innenabstand für alle Kinder
    alignItems: "center", // Zentriere Kinder horizontal
    justifyContent: "center", // Standardmäßig oben beginnen
    shadowColor: "#808080",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Für Android
  },
});

export default NavigationBar;
