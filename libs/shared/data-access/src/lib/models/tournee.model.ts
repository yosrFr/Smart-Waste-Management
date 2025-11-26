import { StatutTournee } from "../enums";
import { GeoPoint } from "../interfaces";
import { PointDeCollecte } from "./point-de-collecte.model";
import { Employe } from "./utilisateur.model";
import { Vehicule } from "./vehicule.model";

/**
 * Modèle pour une tournée de collecte
 */
export interface Tournee {
    id: string;
    /** Date et heure de début estimées */
    dateDeb: string;
    /** Date et heure de fin estimées */
    dateFin: string;
    /** Statut actuel de la tournée */
    statut: StatutTournee;
    /** Véhicule assignée à la tournée */
    vehicule: Vehicule;
    /** Employé assigné à la tournée */
    employe: Employe;
    /** Liste des points de collecte à visiter */
    pointsDeCollecte: PointDeCollecte[];
    /** Position GPS actuelle de véhicule mise à jours en temps réel */
    positionActuelle?: GeoPoint;
}