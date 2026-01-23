// Rutas de la aplicación

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SCREENING: '/screening',
  GAMES: '/games',
  RESOURCES: '/resources',
  CONTACT: '/contact'
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
