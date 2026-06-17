import { fetchWithAuth } from './fetchWithAuth';
import { API_BASE_URL } from '../constants/Config';
import type { Groupe, GroupeRequest, SyncResult } from '../types/Groupe';
import { logger } from '../utils/logger';

const ROUTE = '/groupes';

//Récupère tous les groupes avec leurs stations
export async function getAllGroupes(): Promise<Groupe[]> {
    const response = await fetchWithAuth(`${API_BASE_URL}${ROUTE}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        logger.error('GroupeService', `Erreur récupération groupes (status ${response.status})`);
        throw new Error('Impossible de récupérer les groupes');
    }
    return await response.json();
}

//Déclenche la synchronistation auto
export async function syncGroupesAuto(): Promise<SyncResult> {
    const response = await fetchWithAuth(`${API_BASE_URL}${ROUTE}/sync-auto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        logger.error('GroupeService', `Erreur sync auto (status ${response.status})`);
        throw new Error('Erreur lors de la synchronisation');
    }
    return await response.json();
}

//Créer un nouveau groupe manuellement
export async function creerGroupe(data: GroupeRequest): Promise<Groupe> {
    const response = await fetchWithAuth(`${API_BASE_URL}${ROUTE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        logger.error('GroupeService', `Erreur création groupe (status ${response.status})`);
        throw new Error('Impossible de créer le groupe');
    }
    return await response.json();
}

//Modifie un groupe existant
export async function modifierGroupe(id: string, data: GroupeRequest): Promise<Groupe> {
    const response = await fetchWithAuth(`${API_BASE_URL}${ROUTE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        logger.error('GroupeService', `Erreur modification groupe (status ${response.status})`);
        throw new Error('Impossible de modifier le groupe');
    }
    return await response.json();
}

//Supprime un groupe 
export async function supprimerGroupe(id: string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}${ROUTE}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        logger.error('GroupeService', `Erreur suppression groupe (status ${response.status})`);
        throw new Error('Impossible de supprimer le groupe');
    }
}