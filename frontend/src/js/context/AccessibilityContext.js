import { createContext, useState, useEffect } from "react";

export const AccessibilityContext = createContext();

// Valores válidos
const VALID_FONTS = ["Lato", "Lexend", "Arial", "Georgia", "LexendLocal", "AtkinsonLocal", "OpenDyslexicLocal"];
const VALID_BACKGROUNDS = ["white", "cream", "sepia"];

export function AccessibilityProvider({ children }) {
  const [font, setFont] = useState("Lato");
  const [fontSize, setFontSize] = useState(18);
  const [spacing, setSpacing] = useState(1.6);
  const [darkMode, setDarkMode] = useState(false);
  const [background, setBackground] = useState("white");

  // Limpiar localStorage al iniciar si tiene valores inválidos
  useEffect(() => {
    const savedFont = localStorage.getItem("ivi_font");
    
    // Si la fuente guardada no es válida, limpiar todo
    if (savedFont && !VALID_FONTS.includes(savedFont)) {
      console.log("Limpiando localStorage por fuente inválida:", savedFont);
      localStorage.clear();
    }
  }, []);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedFont = localStorage.getItem("ivi_font");
      const savedFontSize = localStorage.getItem("ivi_fontSize");
      const savedSpacing = localStorage.getItem("ivi_spacing");
      const savedDarkMode = localStorage.getItem("ivi_darkMode");
      const savedBackground = localStorage.getItem("ivi_background");

      if (savedFont && VALID_FONTS.includes(savedFont)) {
        setFont(savedFont);
      }
      if (savedFontSize) {
        const size = Number(savedFontSize);
        if (size >= 14 && size <= 28) setFontSize(size);
      }
      if (savedSpacing) {
        const space = Number(savedSpacing);
        if (space >= 1 && space <= 2.5) setSpacing(space);
      }
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
      if (savedBackground && VALID_BACKGROUNDS.includes(savedBackground)) {
        setBackground(savedBackground);
      }
    } catch (error) {
      console.error("Error loading accessibility settings:", error);
      localStorage.clear();
    }
  }, []);

  // Guardar en localStorage
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
    localStorage.setItem("ivi_darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("ivi_background", background);
  }, [background]);

  return (
    <AccessibilityContext.Provider
      value={{
        font,
        setFont,
        fontSize,
        setFontSize,
        spacing,
        setSpacing,
        darkMode,
        setDarkMode,
        background,
        setBackground
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
