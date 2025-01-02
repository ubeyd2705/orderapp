import { Firestore, Timestamp } from "firebase/firestore";

export interface Product {
  id: number;
  price: number;
  imageSrc: string;
  ratingScore: number;
  categoryId: string;
  title: string;
  orderDuration: number;
  isfavorite: boolean;
}
export interface Category {
  id: string;
  title: string;
}

export interface Order {
  id: string;
  pr: Product;
  quantity: number;
}

// Das ist eine einzige Bestellung. Ziel ist es ein Bestellungsarray (also SingleOrder[]) zu erstellen und die einzelenn Bestellung in diesem arrray zu speichern
export interface SingleOrder {
  id: number;
  order: Order[];
  duration: number;
  isRated: boolean;
  isDelivered: boolean;
  startedPreparing: boolean;
  tableNr: number;
  orderedUser: string;
  totalPayment: number;
  requestPayment: boolean;
  isPaid: boolean;
}
export interface rating {
  score: number;
  description: string;
  productTitle: string;
  name: string;
  imageSrc: string | null;
}
export interface user {
  vibration: boolean;
  favoriteProducts: Product[];
}
