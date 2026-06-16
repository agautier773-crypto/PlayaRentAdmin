export type FiltresAdminState = {
    visibilite: 'toutes' | 'visibles' | 'invisibles';
    gps: 'toutes' | 'avecGps' | 'sansGps';
    recherche: string;
};

export const FILTRES_ADMIN_VIDES: FiltresAdminState = {
    visibilite: 'toutes',
    gps: 'toutes',
    recherche: '',
};