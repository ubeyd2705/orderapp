import { createContext } from "react";

// context.ts
import React, { useContext, useState } from "react";

export const OrderIdContext = createContext<number | any>(0);

export const useOrderID = () => useContext(OrderIdContext);

export const OrderIdProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orderId, setOrderId] = useState<number>(0);

  return (
    <OrderIdContext.Provider value={{ orderId, setOrderId }}>
      {children}
    </OrderIdContext.Provider>
  );
};
