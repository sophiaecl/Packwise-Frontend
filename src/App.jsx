// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage'
import Dashboard from './pages/Dashboard/Dashboard'
import InputDesign from './components/AuthForms/InputDesign'
import { AuthProvider, useAuth } from './context/auth-context'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" />;
  }
  
  return children;
};

// Router with AuthProvider
function AppWithProvider() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<InputDesign />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Add other protected routes here */}
      </Routes>
    </AuthProvider>
  );
}

// Main App component
function App() {
  return (
    <BrowserRouter>
      <AppWithProvider />
    </BrowserRouter>
  );
}

export default App;