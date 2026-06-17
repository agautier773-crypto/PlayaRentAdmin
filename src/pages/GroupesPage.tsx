import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/AuthService';
import { getAllGroupes, syncGroupesAuto, supprimerGroupe } from '../services/GroupeService';
import GroupeFormModal from '../components/GroupeFormModal';
import type { Groupe } from '../types/Groupe';
import './GroupesPage.css';

export default function GroupesPage() {
    const navigate = useNavigate();

    const [groupes, setGroupes] = useState<Groupe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [groupeEnEdition, setGroupeEnEdition] = useState<Groupe | null>(null);

    useEffect(() => {
        loadGroupes();
    }, []);

    const loadGroupes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllGroupes();
            setGroupes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncAuto = async () => {
        if (syncing) return;
        setSyncing(true);
        try {
            const result = await syncGroupesAuto();
            alert(result.message);
            await loadGroupes();
        } catch (err) {
            alert('Erreur lors de la synchronisation');
        } finally {
            setSyncing(false);
        }
    };

    const handleCreer = () => {
        setGroupeEnEdition(null);
        setModalOpen(true);
    };

    const handleModifier = (groupe: Groupe) => {
        setGroupeEnEdition(groupe);
        setModalOpen(true);
    };

    const handleSupprimer = async (groupe: Groupe) => {
        if (!confirm(`Supprimer le groupe "${groupe.nom}" ?`)) return;
        try {
            await supprimerGroupe(groupe.id);
            await loadGroupes();
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setGroupeEnEdition(null);
    };

    const handleModalSave = async () => {
        setModalOpen(false);
        setGroupeEnEdition(null);
        await loadGroupes();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="groupes-page">
            <div className="groupes-content">
                <div className="logo-container">
                    <img src="/logo.png" alt="Playa-Rent" className="logo" />
                </div>
                <div className="admin-nav">
                    <button
                        className="nav-link"
                        onClick={() => navigate('/stations')}
                    >
                        Stations
                    </button>
                    <button
                        className="nav-link active"
                        onClick={() => navigate('/groupes')}
                    >
                        Groupes
                    </button>
                </div>

                <h1 className="page-title">Liste des Groupes</h1>

                <div className="actions-bar">
                    <button
                        className="btn-sync"
                        onClick={handleSyncAuto}
                        disabled={syncing}
                    >
                        {syncing ? 'Synchronisation...' : 'Synchroniser auto'}
                    </button>
                    <button className="btn-create" onClick={handleCreer}>
                        + Créer un groupe
                    </button>
                </div>

                {error && <div className="error-banner">{error}</div>}

                {loading ? (
                    <div className="loading">Chargement...</div>
                ) : groupes.length === 0 ? (
                    <div className="empty-state">
                        Aucun groupe pour l'instant. Clique sur "Synchroniser auto" pour détecter
                        les stations co-localisées, ou crée un groupe manuellement.
                    </div>
                ) : (
                    <table className="groupes-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Stations</th>
                                <th>État</th>
                                <th>Équipements</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupes.map((g) => (
                                <tr key={g.id}>
                                    <td>{g.nom}</td>
                                    <td className="centered">{g.stations.length}</td>
                                    <td className="centered">
                                        {g.etat === 'OUVERTE' ? (
                                            <span className="icon-yes">✓ OUVERTE</span>
                                        ) : (
                                            <span className="icon-no">✕ FERMEE</span>
                                        )}
                                    </td>
                                    <td className="centered">
                                        {g.nombreComposantsDisponibles} / {g.nombreComposantsTotal}
                                    </td>
                                    <td className="centered">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleModifier(g)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleSupprimer(g)}
                                        >
                                            Supprimer
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

            {modalOpen && (
                <GroupeFormModal
                    groupe={groupeEnEdition}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            )}
        </div>
    );
}