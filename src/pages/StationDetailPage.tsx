import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStationById, setStationVisibility } from '../services/StationService';
import type { Station } from '../types/Station';
import './StationDetailPage.css';
import StationPhotosSection from '../components/StationPhotosSection';

export default function StationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadStation(id);
  }, [id]);

  const loadStation = async (stationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStationById(stationId);
      setStation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!station) return;
    setToggling(true);
    try {
      await setStationVisibility(station.id, !station.estVisible);
      setStation({ ...station, estVisible: !station.estVisible });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors du toggle');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-content">
          <p className="loading">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="detail-page">
        <div className="detail-content">
          <button className="back-btn" onClick={() => navigate('/stations')}>
            ← Retour à la liste
          </button>
          <div className="error-banner">{error || 'Station introuvable'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-content">
        <button className="back-btn" onClick={() => navigate('/stations')}>
          ← Retour à la liste
        </button>

        <h1 className="station-title">{station.nom}</h1>

        <div className="info-section">
          <h2 className="section-title">Informations</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-title">État</span>
              <span className={`badge badge-${station.etat.toLowerCase()}`}>
                {station.etat}
              </span>
            </div>
            <div className="info-item">
              <span className="info-title">Composants</span>
              <span className="info-label">{station.typeComposant}</span>
            </div>
            <div className="info-item">
              <span className="info-title">Latitude</span>
              <span className="info-label">{station.latitude}</span>
            </div>
            <div className="info-item">
              <span className="info-title">Longitude</span>
              <span className="info-label">{station.longitude}</span>
            </div>
          </div>
        </div>

        <div className="visibility-section">
          <h2 className="section-title">Visibilité dans l'application mobile</h2>
          <div className="visibility-card">
            <div className="visibility-info">
              <div className={`status-indicator ${station.estVisible ? 'visible' : 'hidden'}`}>
                {station.estVisible ? '✓ Visible' : '✕ Cachée'}
              </div>
              <p className="visibility-description">
                {station.estVisible
                  ? "Cette station est actuellement affichée dans l'app mobile."
                  : "Cette station n'apparaît pas dans l'app mobile."}
              </p>
            </div>
            <button
              className={`toggle-btn ${station.estVisible ? 'toggle-hide' : 'toggle-show'}`}
              onClick={handleToggleVisibility}
              disabled={toggling}
            >
              {toggling
                ? '...'
                : station.estVisible
                ? 'Masquer'
                : 'Rendre visible'}
            </button>
          </div>
        </div>
        <StationPhotosSection stationId={station.id} />
      </div>
    </div>
  );
}