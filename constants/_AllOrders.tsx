import { SingleOrder } from "@/constants/types";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const getOrdersBackend = async () => {
  const orderArray: SingleOrder[] = [];
  const q = query(collection(db, "AllOrders"));
  console.log("Render: es wird gelsen");
  const querySnapshot = await getDocs(q);
  console.log("Quoteeeeeeeeeee");
  querySnapshot.forEach((doc) => {
    orderArray.push({
      id: doc.data().id,
      order: doc.data().order,
      duration: doc.data().duration,
    });
  });
  // const filteredArray = productArray.filter(
  // (prdct) => prdct.categoryId === categoryFilter
  // );
  return orderArray;
};
