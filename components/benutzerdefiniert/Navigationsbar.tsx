import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native";
import { db } from "@/firebase/firebase";
import { Category } from "@/constants/types";
import { collection, getDocs, query } from "firebase/firestore";
import { useTheme } from "@/constants/_themeContext";

const NavigationBar = ({ isSelect }: { isSelect: any }) => {
  const [kategorien, setKategorien] = useState<Category[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const categoryArray: Category[] = [];
    const q = query(collection(db, "categories"));
    const querySnapshot = await getDocs(q);
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
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.contentContainer}>
        {kategorien.map((cat, index) => (
          <TouchableOpacity
            style={[
              styles.touchable,
              { backgroundColor: theme.backgroundColor3 },
            ]}
            onPress={() => isSelect(cat.title)}
            key={index}
          >
            <Text style={[styles.text, { color: theme.textColor }]}>
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: "auto",
  },
  contentContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  touchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    minWidth: 60,
    borderRadius: 8,
    margin: 4,
  },
  text: {
    textAlign: "center",
    fontSize: 15,
  },
});

export default NavigationBar;
