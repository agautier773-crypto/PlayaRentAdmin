import { API_BASE_URL, ROUTES, STORAGE_KEYS } from '../constants/Config';
import type { Station } from '../types/Station';

export async function getAllStations(): Promise<Station[]> {
    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    if(!token) {
        throw new Error ('Aucun token dispo');
    }

    const response = await fetch(`${API_BASE_URL}${ROUTES.STATIONS}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur récupération stations (status ${response.status})`);
  }

  return await response.json();
}

// Changer la visibilité d'une station 
export async function setStationVisibility(idStation: string, visible: boolean):Promise<void>{
    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    if(!token){
        throw new Error ("Aucun token dispo");
    }

    const response = await fetch(`${API_BASE_URL}${ROUTES.STATIONS_CONFIG}/${idStation}/visible`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visible }),
        }
    );
    if(!response.ok) {
        throw new Error ("Erreur modif visibilité (status ${response.status})");
    }
}

//Récupère une station par son id 

export async function getStationById(id: string): Promise<Station>{
    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    if(!token){
        throw new Error ("Aucun token dispo");
    }

    const response = await fetch(`${API_BASE_URL}${ROUTES.STATIONS}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if(!response.ok){
        if(response.status === 404){
            throw new Error ('Station introuvable');
        }
        throw new Error ("Erreur récupération station (status ${response.status})");
    }

    return await response.json();
}
    

