import type { Station } from './Station';

export type Groupe = {
    id: string;
    nom: string;
    description: string | null;
    latitude: number | null;
    longitude: number | null;
    etat: string;
    nombreComposantsTotal: number;
    nombreComposantsDisponibles: number;
    stations: Station[];
};

export type GroupeRequest = {
    nom: string;
    description: string | null;
    idsStations: string[];
};

export type SyncResult = {
    nouveauxGroupesCrees: number;
    stationsRetirees: number;
    message: string;
};