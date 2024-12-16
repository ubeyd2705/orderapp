import { createContext } from "react";

// context.ts
import React, { useContext, useState } from "react";

export const TischnummerContext = createContext<any | undefined>(undefined);

export const useTischnummer = () => useContext(TischnummerContext);

export const TischnummerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tischnummer, setTischnummer] = useState<string | undefined>(undefined);

  return (
    <TischnummerContext.Provider value={{ tischnummer, setTischnummer }}>
      {children}
    </TischnummerContext.Provider>
  );
};
