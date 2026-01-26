// Constantes de Accesibilidad

export const FONT_OPTIONS = [
  { value: 'Lato', label: 'Lato (Estándar)' },
  { value: 'Lexend', label: 'Lexend (Google)' },
  { value: 'Arial', label: 'Arial (Sans-serif)' },
  { value: 'Georgia', label: 'Georgia (Serif)' },
  { value: 'LexendLocal', label: 'Lexend (Local - Dislexia)' },
  { value: 'AtkinsonLocal', label: 'Atkinson Hyperlegible (Local)' },
  { value: 'OpenDyslexicLocal', label: 'OpenDyslexic (Local - Dislexia)' }
];

export const FONT_SIZE_RANGE = {
  min: 14,
  max: 28,
  default: 18
};

export const SPACING_OPTIONS = {
  normal: 1.5,
  medium: 1.8,
  large: 2.0
};

export const BACKGROUND_MODES = {
  white: { value: 'white', label: 'Blanco' },
  sepia: { value: 'sepia', label: 'Sepia' },
  cream: { value: 'cream', label: 'Crema' }
};

export const CONTRAST_MODES = {
  normal: {
    background: '#ffffff',
    color: '#333333',
    label: 'Normal'
  },
  high: {
    background: '#000000',
    color: '#FFFF00',
    label: 'Alto contraste'
  }
};

export const COLORS = {
  primary: '#3498db',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#16a085',
  dark: '#2c3e50',
  light: '#ecf0f1'
};
