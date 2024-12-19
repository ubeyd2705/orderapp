import { Product } from "@/constants/types";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const getProducts = async () => {
  const productArray: Product[] = [];
  const q = query(collection(db, "products"));
  const querySnapshot = await getDocs(q);
  console.log("Quoteeeeeeeeeeee");
  querySnapshot.forEach((doc) => {
    productArray.push({
      id: doc.data().id,
      title: doc.data().title,
      price: doc.data().price,
      imageSrc: doc.data().imageSrc,
      categoryId: doc.data().categoryId,
      ratingScore: doc.data().RatingScore,
      orderDuration: doc.data().orderDuration,
    });
  });

  return productArray;
};
