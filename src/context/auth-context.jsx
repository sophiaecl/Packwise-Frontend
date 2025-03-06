// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authService.login(credentials);
      // You could fetch user details here if needed
      setCurrentUser({ username: credentials.username });
      navigate('/dashboard');
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      await authService.register(userData);
      // Auto login after registration
      return login({ username: userData.username, password: userData.password });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/auth');
  };

  // Check authentication status on load
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      if (!isAuth) {
        setCurrentUser(null);
      } else {
        // Here you could fetch user profile data if needed
        // For now, we'll just mark user as authenticated
        setCurrentUser({ authenticated: true });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Context value
  const value = {
    currentUser,
    login,
    register,
    logout,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};