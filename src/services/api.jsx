// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
    
    return axios.post(`${API_URL}/auth/register`, formData);
  },
  
  // Login user
  login: async (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await axios.post(`${API_URL}/auth/token`, formData);
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
  getTrips: () => api.get('/trips'),
  getTripWeather: (tripId) => api.get(`/trips/weather/${tripId}`),
  createTrip: (tripData) => api.post('/trips', tripData),
  getTrip: (tripId) => api.get(`/trips/${tripId}`),
  updateTrip: (tripId, tripData) => api.put(`/trips/${tripId}`, tripData),
  deleteTrip: (tripId) => api.delete(`/trips/${tripId}`)
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
  updatePackingList: (listId, listData) => api.put(`/packing/${listId}`, listData, { params: { list_id: listId } }),
  // Delete a packing list
  deletePackingList: (listId) => api.delete(`/packing/${listId}`, { params: { list_id: listId } })
};

export default api;