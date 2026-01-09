import { createContext, useState, useEffect } from "react";

export const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [font, setFont] = useState("Lexend");
  const [fontSize, setFontSize] = useState(18);
  const [spacing, setSpacing] = useState(1.5);
  const [contrast, setContrast] = useState(false);
  const [background, setBackground] = useState("white");

  // Cargar valores del localStorage al montar
  useEffect(() => {
    const savedFont = localStorage.getItem("ivi_font");
    const savedFontSize = localStorage.getItem("ivi_fontSize");
    const savedSpacing = localStorage.getItem("ivi_spacing");
    const savedContrast = localStorage.getItem("ivi_contrast");
    const savedBackground = localStorage.getItem("ivi_background");

    if (savedFont) setFont(savedFont);
    if (savedFontSize) setFontSize(parseInt(savedFontSize, 10));
    if (savedSpacing) setSpacing(parseFloat(savedSpacing));
    if (savedContrast) setContrast(JSON.parse(savedContrast));
    if (savedBackground) setBackground(savedBackground);
  }, []);

  // Guardar valores en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("ivi_font", font);
  }, [font]);

  useEffect(() => {
    localStorage.setItem("ivi_fontSize", String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("ivi_spacing", String(spacing));
  }, [spacing]);

  useEffect(() => {
    localStorage.setItem("ivi_contrast", JSON.stringify(contrast));
  }, [contrast]);

  useEffect(() => {
    localStorage.setItem("ivi_background", background);
  }, [background]);

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

