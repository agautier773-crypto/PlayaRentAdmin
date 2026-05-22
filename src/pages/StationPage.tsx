import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/AuthService';

export default function StationsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Stations</h1>
      <p>Bienvenue {user?.prenom} {user?.nom} </p>
      
      <button onClick={handleLogout} style={{ marginTop: 20 }}>
        Se déconnecter
      </button>
    </div>
  );
}