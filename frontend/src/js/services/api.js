// Servicios de API

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const API = {
  // Ejemplos de endpoints
  screening: {
    get: () => apiCall('/screening/'),
    post: (data) => apiCall('/screening/', { method: 'POST', body: JSON.stringify(data) })
  },
  users: {
    get: () => apiCall('/users/'),
    post: (data) => apiCall('/users/', { method: 'POST', body: JSON.stringify(data) })
  }
};
