export type Station = {
    id: string;
    nom: string;
    etat: string;
    latitude: number;
    longitude: number;
    nombreComposantsTotal: number;
    nombreComposantsDisponibles : number;
    typeComposant: string;
    adresse: string;
    estVisible: boolean;
    composants?: Equipement[];
}

export type Equipement = {
    id: string;
    idStation: string;
    type: string;
    nom: string;
    disponible: boolean;
    informations?: { contenu: string } | null;
    heureRetour?: string | null;
};