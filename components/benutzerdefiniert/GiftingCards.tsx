import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from "react-native";
import React, { useEffect } from "react";
import { codes } from "./../../constants/data";
import SingleCard from "./SingleCard";
import { useAuth } from "@/constants/authprovider";
import Toast from "react-native-toast-message";

const giftingCards = () => {
  const { user, gifts, updateGifts, fetchGifts, fetchVibration, vibration } =
    useAuth();

  const handleRedeemCoupon = () => {
    updateGifts(true);
    if (vibration) {
      Vibration.vibrate(100);
    }
    Toast.show({
      type: "success",
      text1: "Coupon bestätigt",
      text2: `Der Code wurde an: ${user?.email} versendet`,
    });
  };
  useEffect(() => {
    if (user) {
      fetchGifts(user.uid);
    }
  }, []);
  useEffect(() => {
    if (user) {
      fetchVibration(user.uid);
    }
  }, [vibration, user]);

  return (
    <ScrollView>
      <View className="flex justify-center items-center bg-gray-100 p-5">
        {codes.map((code, index) => (
          <SingleCard
            title={code.title}
            coupon={code.coupon}
            abled={gifts != undefined && gifts > 0}
            handleClickRedeem={handleRedeemCoupon}
            key={index}
          ></SingleCard>
        ))}
      </View>
    </ScrollView>
  );
};

export default giftingCards;
