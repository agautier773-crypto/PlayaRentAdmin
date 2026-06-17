import { useState, useEffect } from 'react';
import { creerGroupe, modifierGroupe } from '../services/GroupeService';
import { getAllStations } from '../services/StationService';
import type { Groupe } from '../types/Groupe';
import type { Station } from '../types/Station';
import './GroupeFormModal.css';

type Props = {
    groupe: Groupe | null;          // null = création, sinon édition
    onClose: () => void;
    onSave: () => void;
};

export default function GroupeFormModal({ groupe, onClose, onSave }: Props) {
    const [nom, setNom] = useState(groupe?.nom || '');
    const [description, setDescription] = useState(groupe?.description || '');
    const [toutesStations, setToutesStations] = useState<Station[]>([]);
    const [idsStationsSelectionnees, setIdsStationsSelectionnees] = useState<string[]>(
        groupe?.stations.map((s) => s.id) || []
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStations();
    }, []);

    const loadStations = async () => {
        try {
            const data = await getAllStations();
            setToutesStations(data);
        } catch (err) {
            setError('Impossible de charger les stations');
        }
    };

    const toggleStation = (idStation: string) => {
        if (idsStationsSelectionnees.includes(idStation)) {
            setIdsStationsSelectionnees(idsStationsSelectionnees.filter((id) => id !== idStation));
        } else {
            setIdsStationsSelectionnees([...idsStationsSelectionnees, idStation]);
        }
    };

    const handleSave = async () => {
        if (!nom.trim()) {
            setError('Le nom est obligatoire');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const request = {
                nom: nom.trim(),
                description: description.trim() || null,
                idsStations: idsStationsSelectionnees,
            };

            if (groupe) {
                await modifierGroupe(groupe.id, request);
            } else {
                await creerGroupe(request);
            }
            onSave();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{groupe ? 'Modifier le groupe' : 'Créer un groupe'}</h2>

                {error && <div className="error-banner">{error}</div>}

                <div className="form-group">
                    <label htmlFor="nom">Nom *</label>
                    <input
                        id="nom"
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Nom du groupe"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optionnel)"
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>Stations du groupe ({idsStationsSelectionnees.length} sélectionnée(s))</label>
                    <div className="stations-list">
                        {toutesStations.map((s) => (
                            <label key={s.id} className="station-item">
                                <input
                                    type="checkbox"
                                    checked={idsStationsSelectionnees.includes(s.id)}
                                    onChange={() => toggleStation(s.id)}
                                />
                                <span>{s.nom}</span>
                                {s.latitude != null && s.longitude != null && (
                                    <span className="station-gps">
                                        ({s.latitude.toFixed(4)}, {s.longitude.toFixed(4)})
                                    </span>
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={saving}>
                        Annuler
                    </button>
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
}