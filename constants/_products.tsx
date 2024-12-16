import { Product } from "@/constants/types";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const getProducts = async () => {
  const productArray: Product[] = [];
  const q = query(collection(db, "products"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    productArray.push({
      id: doc.data().id,
      title: doc.data().title,
      price: doc.data().price,
      imageSrc: doc.data().imageSrc,
      categoryId: doc.data().categoryId,
      ratingId: doc.data().ratingId,
      orderDuration: doc.data().orderDuration,
    });
  });
  // const filteredArray = productArray.filter(
  // (prdct) => prdct.categoryId === categoryFilter
  // );
  return productArray;
};
