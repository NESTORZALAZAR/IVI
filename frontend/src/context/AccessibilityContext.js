import { createContext, useState } from "react";

export const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [font, setFont] = useState("Lexend");
  const [fontSize, setFontSize] = useState(18);
  const [spacing, setSpacing] = useState(1.5);
  const [contrast, setContrast] = useState(false);
  const [background, setBackground] = useState("white");

  return (
    <AccessibilityContext.Provider value={{
      font, setFont,
      fontSize, setFontSize,
      spacing, setSpacing,
      contrast, setContrast,
      background, setBackground
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}
