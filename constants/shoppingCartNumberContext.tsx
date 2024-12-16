import { createContext } from "react";
import React, { useContext, useState } from "react";

//Variable wurde erstellt
export const CartNumberContext = createContext<any | undefined>(0);

//variable zum Nutzen
export const useCartNumberContext = () => useContext(CartNumberContext);

export const CartNumberContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [CartNumber, setCartNumber] = useState<number | undefined>(0);

  return (
    <CartNumberContext.Provider value={{ CartNumber, setCartNumber }}>
      {children}
    </CartNumberContext.Provider>
  );
};
