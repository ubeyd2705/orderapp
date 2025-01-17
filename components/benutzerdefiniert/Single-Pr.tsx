import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/constants/authprovider";
import { allImageSources } from "@/constants/data";
import { useTheme } from "@/constants/_themeContext";

export default function Produkt({
  orderedItemId,
  title,
  id,
  imageSrc,
  ratingScore,
  price,
  addToFavorite,
  deleteFromFavorite,
  isfavorite,
}: {
  orderedItemId: any;
  title: String;
  ratingScore: number;
  imageSrc: string;
  price: number;
  categoryId: String;
  id: number;
  addToFavorite: any;
  deleteFromFavorite: any;
  isfavorite: boolean;
}) {
  const handleFavorite = () => {
    if (!isfavorite) {
      addToFavorite();
    } else {
      deleteFromFavorite();
    }
  };
  const [noteModalVisible, setnoteModalVisible] = useState(false);
  const [note, setnote] = useState("");
  const { user } = useAuth();
  const { theme } = useTheme();
  const handleBuy = () => {
    setnoteModalVisible(true);
  };
  const handleConfirmNote = () => {
    orderedItemId(id, note);
    setnoteModalVisible(false);
    setnote(""); // Reset note
  };

  return (
    <View
      className="flex flex-row p-4 rounded-lg shadow-lg"
      style={{
        backgroundColor: theme.backgroundColor3,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Linke seite: Fotos and details */}
      <View className="flex flex-row" style={{ flex: 1, alignItems: "center" }}>
        {/* Image */}
        <Image
          style={{
            width: 70,
            height: 70,
            borderRadius: 15,
            marginRight: 10,
          }}
          source={allImageSources[imageSrc]}
          contentFit="cover"
        />

        {/* Informationen */}
        <View>
          {/* Titel */}
          <Text
            className="text-lg font-black"
            style={{ color: theme.textColor }}
          >
            {title}
          </Text>

          {/* bewertung */}
          <Text className="mt-2 text-sm" style={{ color: theme.textColor2 }}>
            Bewertung: {ratingScore ? Number(ratingScore.toFixed(2)) : "0"} ⭐
          </Text>

          {/* Preis */}
          <Text
            className="text-xl font-semibold mt-2"
            style={{ color: theme.textColor }}
          >
            {price}€
          </Text>
        </View>
      </View>

      {/* rechte Seite: Favoriten and kaufen buttons */}
      <View style={{ alignItems: "center" }}>
        {/* Favorite Button */}
        {user?.email !== "gast@hotmail.com" && (
          <TouchableOpacity
            onPress={handleFavorite}
            style={{ marginBottom: 10 }}
          >
            <FontAwesome
              name={isfavorite ? "star" : "star-o"}
              size={24}
              color={isfavorite ? "#FFD700" : "#D3D3D3"}
            />
          </TouchableOpacity>
        )}

        {/* kaufen Button */}
        <TouchableOpacity
          className="bg-sky-700 py-2 px-6 rounded-lg"
          onPress={handleBuy}
          style={{
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            elevation: 3, // For shadow effect on Android
          }}
        >
          <Text className="text-white text-lg font-bold">Hinzufügen</Text>
        </TouchableOpacity>
      </View>
      {/* Modal zum hinzufügen von Notizen. Nur optional */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={noteModalVisible}
        onRequestClose={() => setnoteModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: theme.backgroundColor,
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                color: theme.textColor,
              }}
            >
              Notiz hinzufügen (Optional)
            </Text>
            <TextInput
              multiline
              placeholder="Ihre Notiz..."
              value={note}
              onChangeText={setnote}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
                height: 100,
                color: theme.textColor,
                backgroundColor: theme.backgroundColor3,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity onPress={() => setnoteModalVisible(false)}>
                <Text style={{ color: "#ff0000", fontWeight: "bold" }}>
                  Abbrechen
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmNote}>
                <Text style={{ color: "#007BFF", fontWeight: "bold" }}>
                  Weiter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
