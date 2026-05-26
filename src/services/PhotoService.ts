import { API_BASE_URL, STORAGE_KEYS } from '../constants/Config';
import type { Photo } from '../types/Photo';

/**
 * Récupère toutes les photos d'une station.
 */
export async function getPhotosByStation(idStation: string): Promise<Photo[]> {
  const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
  if (!token) {
    throw new Error('Aucun token disponible');
  }

  const response = await fetch(
    `${API_BASE_URL}/photos/stations/${idStation}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Erreur récupération photos (status ${response.status})`);
  }

  return await response.json();
}

/**
 * Upload une nouvelle photo pour une station.
 */
export async function uploadPhoto(
  idStation: string,
  file: File,
  titre: string
): Promise<Photo> {
  const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
  if (!token) {
    throw new Error('Aucun token disponible');
  }

  const formData = new FormData();
  formData.append('file', file);
  if (titre) {
    formData.append('titre', titre);
  }

  const response = await fetch(
    `${API_BASE_URL}/photos/stations/${idStation}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Erreur upload (status ${response.status})`);
  }

  return await response.json();
}

/**
 * Supprime une photo.
 */
export async function deletePhoto(idPhoto: number): Promise<void> {
  const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
  if (!token) {
    throw new Error('Aucun token disponible');
  }

  const response = await fetch(`${API_BASE_URL}/photos/${idPhoto}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur suppression (status ${response.status})`);
  }
}