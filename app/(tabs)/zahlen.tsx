import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

const stars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name={i <= rating ? "star" : "star-o"} // Voller oder leerer Stern
        size={20}
        color={i <= rating ? "#FFD700" : "#D3D3D3"} // Gold für volle Sterne
        style={{ marginRight: 5 }}
      />
    );
  }
  return stars;
};
const TouchableStars = ({ ratingNumber }: { ratingNumber: any }) => {
  return (
    <View className="flex flex-row">
      <TouchableOpacity onPress={() => ratingNumber(1)}>
        <FontAwesome
          key={1}
          size={20}
          name={"star-o"}
          color={"#D3D3D3"}
          style={{ marginRight: 5 }}
        ></FontAwesome>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => ratingNumber(2)}>
        <FontAwesome
          key={2}
          size={20}
          name={"star-o"}
          color={"#D3D3D3"}
          style={{ marginRight: 5 }}
        ></FontAwesome>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => ratingNumber(3)}>
        <FontAwesome
          key={3}
          size={20}
          name={"star-o"}
          color={"#D3D3D3"}
          style={{ marginRight: 5 }}
        ></FontAwesome>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => ratingNumber(4)}>
        <FontAwesome
          key={4}
          size={20}
          name={"star-o"}
          color={"#D3D3D3"}
          style={{ marginRight: 5 }}
        ></FontAwesome>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => ratingNumber(5)}>
        <FontAwesome
          key={5}
          size={20}
          name={"star-o"}
          color={"#D3D3D3"}
          style={{ marginRight: 5 }}
        ></FontAwesome>
      </TouchableOpacity>
    </View>
  );
};

const zahlen = () => {
  const [isStarSelected, setisStarSelected] = useState(false);
  const [rating, setrating] = useState(0);
  const ratingStarclicked: any = (givenRating: number) => {
    setisStarSelected(true);
    setrating(givenRating);
  };
  return (
    <View className="mb-2 h-full flex justify-center items-center">
      <Text className="text-gray-600 font-extrabold ">Qualtiät</Text>
      {!isStarSelected ? (
        <TouchableStars ratingNumber={ratingStarclicked}></TouchableStars>
      ) : (
        <TouchableOpacity onPress={() => setisStarSelected(false)}>
          <View className="flex-row">{stars(rating)}</View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default zahlen;
