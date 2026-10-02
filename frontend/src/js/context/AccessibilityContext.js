import { createContext, useState, useEffect } from "react";

export const AccessibilityContext = createContext();

// Valores válidos
const VALID_FONTS = [
  "Lato",
  "Lexend",
  "Arial",
  "Georgia",
  "LexendLocal",
  "AtkinsonLocal",
  "OpenDyslexicLocal"
];

// Temas unificados: incluyen fondo y color de texto
const VALID_THEMES = ["white", "sepia", "cream", "dark"];
const SETTINGS_VERSION = 2;

const DEFAULT_SETTINGS = {
  settingsVersion: SETTINGS_VERSION,
  font: "Lexend",       // mejor para dislexia
  fontSize: 18,
  spacing: 1.7,
  theme: "white"        // Incluye fondos y modo oscuro unificados
};

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // 🔹 Cargar configuración desde localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ivi_accessibility"));

      if (saved) {
        setSettings(prev => ({
          ...prev,
          font: VALID_FONTS.includes(saved.font) ? saved.font : prev.font,
          fontSize:
            saved.settingsVersion === SETTINGS_VERSION && saved.fontSize >= 14 && saved.fontSize <= 32
              ? saved.fontSize
              : prev.fontSize,
          spacing:
            saved.spacing >= 1.2 && saved.spacing <= 2.5
              ? saved.spacing
              : prev.spacing,
          theme: VALID_THEMES.includes(saved.theme)
            ? saved.theme
            : prev.theme
        }));
      }
    } catch (e) {
      console.error("Error loading accessibility settings:", e);
      localStorage.removeItem("ivi_accessibility");
    }
  }, []);

  // 🔹 Guardar configuración
  useEffect(() => {
    localStorage.setItem("ivi_accessibility", JSON.stringify(settings));
  }, [settings]);

  // 🔹 Métodos para actualizar configuración
  const setFont = font =>
    setSettings(s => ({ ...s, font }));

  const setFontSize = fontSize =>
    setSettings(s => ({ ...s, fontSize }));

  const setSpacing = spacing =>
    setSettings(s => ({ ...s, spacing }));

  const setTheme = theme =>
    setSettings(s => ({ ...s, theme }));

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setFont,
        setFontSize,
        setSpacing,
        setTheme
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
