import { useState, useEffect, useRef } from 'react';
import { getPhotosByStation, uploadPhoto, deletePhoto } from '../services/PhotoService';
import type { Photo } from '../types/Photo';
import './StationPhotosSection.css';

const MAX_PHOTOS = 5;

type Props = {
  stationId: string;
};

export default function StationPhotosSection({ stationId }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [titre, setTitre] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, [stationId]);

  const loadPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhotosByStation(stationId);
      setPhotos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Sélectionne un fichier');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const newPhoto = await uploadPhoto(stationId, selectedFile, titre);
      setPhotos([...photos, newPhoto]);
      setTitre('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    const confirm = window.confirm(
      `Supprimer la photo "${photo.titre || 'sans titre'}" ?`
    );
    if (!confirm) return;

    try {
      await deletePhoto(photo.idPhoto);
      setPhotos(photos.filter((p) => p.idPhoto !== photo.idPhoto));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur suppression');
    }
  };

  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <div className="photos-section">
      <h2 className="section-title">
        Photos ({photos.length} / {MAX_PHOTOS})
      </h2>

      {loading ? (
        <p className="loading">Chargement des photos...</p>
      ) : (
        <>
          <div className="photos-gallery">
            {photos.length === 0 ? (
              <p className="empty">Aucune photo pour cette station</p>
            ) : (
              photos.map((photo) => (
                <div key={photo.idPhoto} className="photo-card">
                  <img
                    src={photo.url}
                    alt={photo.titre || 'Photo de la station'}
                    className="photo-thumbnail"
                  />
                  <div className="photo-info">
                    <p className="photo-titre">
                      {photo.titre || <em>Sans titre</em>}
                    </p>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(photo)}
                    >
                        Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {canAddMore ? (
            <div className="upload-section">
              <h3 className="upload-title">Ajouter une photo</h3>
              <div className="upload-form">
                <input
                  type="text"
                  placeholder="Titre (optionnel)"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  className="titre-input"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="file-input"
                />
                <button
                  className="upload-btn"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? 'Envoi...' : 'Ajouter une photo'}
                </button>
              </div>
              {selectedFile && (
                <p className="selected-file">
                  Fichier sélectionné : <strong>{selectedFile.name}</strong>
                </p>
              )}
            </div>
          ) : (
            <p className="max-reached">
              Limite de {MAX_PHOTOS} photos atteinte. Supprime une photo pour en ajouter une nouvelle.
            </p>
          )}

          {error && <div className="error-banner">{error}</div>}
        </>
      )}
    </div>
  );
}