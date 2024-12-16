import { Firestore } from "firebase/firestore";

export interface Product {
  id: number;
  price: number;
  imageSrc: string;
  ratingId: string;
  categoryId: string;
  title: string;
  orderDuration: number;
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

// Das ist eine einzige Bestellung. Ziel ist es ein Bestellungsarray (also SingleOrder[]) zu erstellen und die einzelenn Bestellung in ddiesem arrray zu speichern
export interface SingleOrder {
  id: number;
  order: Order[];
  duration: number;
}
