import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StationsPage from './pages/StationPage';
import { isLoggedIn } from './services/AuthService';
import StationDetailPage from './pages/StationDetailPage';
import StationCreatePage from './pages/StationCreatePage';

// Composant pour protéger une route : redirige vers /login si pas connecté
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;