import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import StationsPage from './pages/StationPage';
import { isLoggedIn } from './services/AuthService';
import { setOnSessionExpired } from './services/fetchWithAuth';
import StationDetailPage from './pages/StationDetailPage';
import StationCreatePage from './pages/StationCreatePage';

// Composant pour protéger une route : redirige vers /login si pas connecté
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Composant interne au Router pour pouvoir utiliser useNavigate
function AppRoutes() {
  const navigate = useNavigate();

  // Enregistre le callback : si la session expire vraiment, redirige vers /login
  useEffect(() => {
    setOnSessionExpired(() => {
      navigate('/login');
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/stations"
        element={
          <ProtectedRoute>
            <StationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stations/new"
        element={
          <ProtectedRoute>
            <StationCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stations/:id"
        element={
          <ProtectedRoute>
            <StationDetailPage />
          </ProtectedRoute>
        }
      />
      {/* Route par défaut : redirige vers /stations (qui redirigera vers /login si pas connecté) */}
      <Route path="*" element={<Navigate to="/stations" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;