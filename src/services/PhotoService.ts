import { fetchWithAuth } from './fetchWithAuth';
import type { Photo } from '../types/Photo';

/**
 * Récupère toutes les photos d'une station.
 */
export async function getPhotosByStation(idStation: string): Promise<Photo[]> {
  const response = await fetchWithAuth(`/photos/stations/${idStation}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Erreur récupération photos (status ${response.status})`);
  }

  return await response.json();
}

/**
 * Upload une nouvelle photo pour une station.
 * Cas spécial : multipart/form-data → on ne met PAS de Content-Type.
 */
export async function uploadPhoto(
  idStation: string,
  file: File,
  titre: string
): Promise<Photo> {
  const formData = new FormData();
  formData.append('file', file);
  if (titre) {
    formData.append('titre', titre);
  }

  const response = await fetchWithAuth(`/photos/stations/${idStation}`, {
    method: 'POST',
    headers: {
      // Vide intentionnellement : le navigateur va définir
      // automatiquement le bon Content-Type avec le boundary.
    },
    body: formData,
  });

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
  const response = await fetchWithAuth(`/photos/${idPhoto}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Erreur suppression (status ${response.status})`);
  }
}