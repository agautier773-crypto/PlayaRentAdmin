import { fetchWithAuth } from './fetchWithAuth';
import { ROUTES } from '../constants/Config';
import type { Station } from '../types/Station';

export async function getAllStations(): Promise<Station[]> {
  const response = await fetchWithAuth(ROUTES.STATIONS, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Erreur récupération stations (status ${response.status})`);
  }

  return await response.json();
}

// Changer la visibilité d'une station 
export async function setStationVisibility(idStation: string, visible: boolean): Promise<void> {
  const response = await fetchWithAuth(`${ROUTES.STATIONS_CONFIG}/${idStation}/visible`, {
    method: 'PUT',
    body: JSON.stringify({ visible }),
  });

  if (!response.ok) {
    throw new Error(`Erreur modif visibilité (status ${response.status})`);
  }
}

// Récupère une station par son id 
export async function getStationById(id: string): Promise<Station> {
  const response = await fetchWithAuth(`${ROUTES.STATIONS}/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Station introuvable');
    }
    throw new Error(`Erreur récupération station (status ${response.status})`);
  }

  return await response.json();
}

