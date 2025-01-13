import { View, ScrollView, Vibration } from "react-native";
import React, { useEffect } from "react";
import { codes } from "./../../constants/data";
import SingleCard from "./SingleCard";
import { useAuth } from "@/constants/authprovider";
import Toast from "react-native-toast-message";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const giftingCards = () => {
  const { user, gifts, updateGifts, fetchGifts, fetchVibration, vibration } =
    useAuth();
  const colorScheme = useColorScheme();

  const handleRedeemCoupon = () => {
    updateGifts(false);
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
      <View
        className="flex justify-center items-center p-5"
        style={{
          backgroundColor: `${Colors[colorScheme ?? "light"].background2}`,
        }}
      >
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
