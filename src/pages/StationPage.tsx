import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/AuthService';
import { getAllStations } from '../services/StationService';
import type { Station } from '../types/Station';
import './StationsPage.css';

export default function StationsPage() {
  const navigate = useNavigate();

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllStations();
      setStations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stationId: string) => {
    navigate(`/stations/${stationId}`);
  };

  const handleCreate = () => {
    navigate('/stations/new');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="stations-page">
      <div className="stations-content">
        <div className="logo-container">
          <img src="/logo.png" alt="Playa-Rent" className="logo" />
        </div>

        <h1 className="page-title">Liste des Stations</h1>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <table className="stations-table">
            <thead>
              <tr>
                <th>Station Nom</th>
                <th>Ouvert</th>
                <th>Visible</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station.id}>
                  <td className="station-Nom">{station.nom}</td>
                  <td className="centered">
                    {station.etat === 'OUVERTE' ? (
                      <span className="icon-yes">✓</span>
                    ) : (
                      <span className="icon-no">✕</span>
                    )}
                  </td>
                  <td className="centered">
                    {station.estVisible ? (
                      <span className="icon-yes">✓</span>
                    ) : (
                      <span className="icon-no">✕</span>
                    )}
                  </td>
                  <td className="centered">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(station.id)}
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="create-btn" onClick={handleCreate}>
          Créer une nouvelle station manuellement
        </button>

        <button className="logout-link" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}