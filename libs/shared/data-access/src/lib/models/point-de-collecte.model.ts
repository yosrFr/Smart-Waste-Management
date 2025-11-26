import { EtatConteneur, TypeDechet } from "../enums";
import { GeoPoint } from "../interfaces";

export interface PointDeCollecte {
    id: string;
    localisation: GeoPoint;
    /** Type de déchet aue le véhicule collecte */
    typeDechet: TypeDechet;
    /** Niveau de remplissage de conteneur en pourcent (0-100%) */
    niveauRemplissage: number;
    /** Etat actuel du conteneur */
    etat: EtatConteneur;
}