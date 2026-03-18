import { createContext, useContext, useState, ReactNode } from "react";

type CursorDirection = "left" | "right" | null;

const CursorContext = createContext<{
  direction: CursorDirection;
  setDirection: (d: CursorDirection) => void;
}>({ direction: null, setDirection: () => {} });

export const useCursorDirection = () => useContext(CursorContext);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [direction, setDirection] = useState<CursorDirection>(null);
  return (
    <CursorContext.Provider value={{ direction, setDirection }}>
      {children}
    </CursorContext.Provider>
  );
};
