// Custom hook para accesibilidad
import { useContext } from 'react';
import { AccessibilityContext } from '../context/AccessibilityContext';

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  
  if (!context) {
    throw new Error('useAccessibility debe ser usado dentro de AccessibilityProvider');
  }

  return context;
};
