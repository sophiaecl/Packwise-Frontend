// src/services/api.js
import axios from 'axios';

/* const API_URL = 'http://localhost:8000';
const API_URL = 'https://packwise-backend-580624387675.europe-southwest1.run.app';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});*/

// Make sure URL always uses HTTPS in production
const API_URL = 'https://packwise-backend-580624387675.europe-southwest1.run.app';

// Force HTTPS for non-localhost URLs
const secureUrl = API_URL.startsWith('http:') && !API_URL.includes('localhost') 
  ? API_URL.replace('http:', 'https:') 
  : API_URL;

const api = axios.create({
  baseURL: secureUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add protocol enforcement to request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Force HTTPS for production URLs
    if (config.url && !config.url.includes('localhost') && config.url.startsWith('http:')) {
      config.url = config.url.replace('http:', 'https:');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/* Request interceptor to attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);*/

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 responses (unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  // Register new user
  register: async (userData) => {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('name', userData.name);
    formData.append('age', userData.age);
    formData.append('gender', userData.gender);
    
    return axios.post(`https://packwise-backend-580624387675.europe-southwest1.run.app/auth/register`, formData);
  },
  
  // Login user
  login: async (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await axios.post(`https://packwise-backend-580624387675.europe-southwest1.run.app/auth/token`, formData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
  
  // Logout user (client-side)
  logout: () => {
    localStorage.removeItem('token');
    // Optional: Call logout endpoint
    return api.post('/auth/logout');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

// Trip services
export const tripService = {
  getTrips: () => api.get('/dashboard'),
  getTripWeather: (tripId) => api.get(`/trips/weather/${tripId}`),
  createTrip: (tripData) => api.post('/trips', tripData),
  getTrip: (tripId) => api.get(`/trips/${tripId}`),
  updateTrip: (tripId, tripData) => api.put(`/trips/update/${tripId}`, tripData),
  deleteTrip: (tripId) => api.delete(`/trips/delete/${tripId}`),
  getHistoricalWeather: (tripId) => api.get(`/trips/weather/historical/${tripId}`)
};

// Dashboard services
export const dashboardService = {
  getData: () => api.get('/dashboard')
};

// Packing services
export const packingService = {
  // Get all packing lists for a trip
  getPackingLists: (tripId) => api.get(`/packing/lists/${tripId}`),
  // Get a specific packing list by its ID - using query parameter
  getPackingList: (listId) => api.get(`/packing/${listId}`, { params: { list_id: listId } }),
  // Generate a new packing list for a trip
  createPackingList: (tripId) => api.post(`/packing/generate/${tripId}`),
  // Update an existing packing list
  updatePackingList: (listId, listData) => api.put(`/packing/${listId}`, listData),
  // Delete a packing list
  deletePackingList: (listId) => api.delete(`/packing/${listId}`, { params: { list_id: listId } }),
  // Get packing progress for a trip
  getTripPackingProgress: (tripId) => api.get(`/packing/progress/${tripId}`),
  // Get overall packing progress
  getOverallPackingProgress: () => api.get('/packing/progress/all')
}

// Profile services
export const profileService = {
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData)
}

// Recommendation services
export const recommendationService = {
  // Get recommendations for a specific packing list
  getRecommendations: (packingListId, similarityThreshold = 0.7) => api.get(`/packing_recommendations/${packingListId}`, {params: { similarity_threshold: similarityThreshold }})
}
;

export default api;