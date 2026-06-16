import type { Station } from '../types/Station';
import type { FiltresAdminState } from '../types/Filtres';


 //Vérifie si une station passe les filtres admin.
 //Logique ET : tous les critères doivent passer.
 
export function applyFiltres(station: Station, filtres: FiltresAdminState): boolean {
    // Filtre visibilité
    if (filtres.visibilite === 'visibles' && !station.estVisible) {
        return false;
    }
    if (filtres.visibilite === 'invisibles' && station.estVisible) {
        return false;
    }
    if (filtres.gps === 'avecGps') {
    if (station.latitude == null || station.longitude == null) {
        return false;
    }
    }
    if (filtres.gps === 'sansGps') {
        if (station.latitude != null && station.longitude != null) {
            return false;
        }
    }
    
    // 'toutes' ne filtre rien

    // Filtre recherche par nom (insensible à la casse)
    if (filtres.recherche.trim() !== '') {
        const nomNormalise = station.nom.toLowerCase();
        const rechercheNormalisee = filtres.recherche.toLowerCase().trim();
        if (!nomNormalise.includes(rechercheNormalisee)) {
            return false;
        }
    }

    return true;
}