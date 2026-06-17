import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/AuthService';
import { getAllStations } from '../services/StationService';
import type { Station } from '../types/Station';
import { FILTRES_ADMIN_VIDES, type FiltresAdminState } from '../types/Filtres';
import { applyFiltres } from '../utils/filtres';
import './StationsPage.css';

export default function StationsPage() {
    const navigate = useNavigate();

    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // États des filtres
    const [filtres, setFiltres] = useState<FiltresAdminState>(FILTRES_ADMIN_VIDES);

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

    // Liste filtrée — recalculée automatiquement quand stations ou filtres changent
    const stationsFiltrees = useMemo(() => {
        return stations.filter((s) => applyFiltres(s, filtres));
    }, [stations, filtres]);

    const handleEdit = (stationId: string) => {
        navigate(`/stations/${stationId}`);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleResetFiltres = () => {
        setFiltres(FILTRES_ADMIN_VIDES);
    };

    const hasActiveFilters = filtres.visibilite !== 'toutes' || filtres.gps !== 'toutes' || filtres.recherche !== '';

    return (
        <div className="stations-page">
            <div className="stations-content">
                <div className="logo-container">
                    <img src="/logo.png" alt="Playa-Rent" className="logo" />
                </div>
                    <div className="admin-nav">
                    <button
                        className="nav-link active"
                        onClick={() => navigate('/stations')}
                    >
                        Stations
                    </button>
                    <button
                        className="nav-link"
                        onClick={() => navigate('/groupes')}
                    >
                        Groupes
                    </button>
                </div>

                <h1 className="page-title">Liste des Stations</h1>

                {error && <div className="error-banner">{error}</div>}

                {/* Barre de filtres */}
                <div className="filtres-bar">
                    {/* Recherche */}
                    <div className="filtre-group">
                        <label htmlFor="recherche-input" className="filtre-label">
                            Rechercher
                        </label>
                        <input
                            id="recherche-input"
                            type="text"
                            className="filtre-input"
                            placeholder="Nom de la station..."
                            value={filtres.recherche}
                            onChange={(e) =>
                                setFiltres({ ...filtres, recherche: e.target.value })
                            }
                        />
                    </div>

                    {/* Visibilité */}
                    <div className="filtre-group">
                        <label htmlFor="visibilite-select" className="filtre-label">
                            Visibilité
                        </label>
                        <select
                            id="visibilite-select"
                            className="filtre-select"
                            value={filtres.visibilite}
                            onChange={(e) =>
                                setFiltres({
                                    ...filtres,
                                    visibilite: e.target.value as FiltresAdminState['visibilite'],
                                })
                            }
                        >
                            <option value="toutes">Toutes</option>
                            <option value="visibles">Visibles uniquement</option>
                            <option value="invisibles">Invisibles uniquement</option>
                        </select>
                    </div>

                    {/* GPS — nouveau bloc, AU MÊME NIVEAU que les autres */}
                    <div className="filtre-group">
                        <label htmlFor="gps-select" className="filtre-label">
                            Coordonnées GPS
                        </label>
                        <select
                            id="gps-select"
                            className="filtre-select"
                            value={filtres.gps}
                            onChange={(e) =>
                                setFiltres({
                                    ...filtres,
                                    gps: e.target.value as FiltresAdminState['gps'],
                                })
                            }
                        >
                            <option value="toutes">Toutes</option>
                            <option value="avecGps">Avec GPS</option>
                            <option value="sansGps">Sans GPS</option>
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button className="filtre-reset-btn" onClick={handleResetFiltres}>
                            Réinitialiser
                        </button>
                    )}
                </div>

                {/* Compteur de résultats */}
                {!loading && (
                    <div className="resultats-count">
                        {stationsFiltrees.length} station{stationsFiltrees.length > 1 ? 's' : ''}
                        {hasActiveFilters && ` sur ${stations.length}`}
                    </div>
                )}

                {loading ? (
                    <div className="loading">Chargement...</div>
                ) : stationsFiltrees.length === 0 ? (
                    <div className="empty-state">
                        Aucune station ne correspond aux critères de recherche.
                    </div>
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
                            {stationsFiltrees.map((station) => (
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

                <button className="logout-link" onClick={handleLogout}>
                    Se déconnecter
                </button>
            </div>
        </div>
    );
}