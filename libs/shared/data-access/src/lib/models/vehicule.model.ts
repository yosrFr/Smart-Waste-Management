import { StatutVehicule, TypeDechet } from '../enums';

/**
 * Modèle pour un véhicule de collecte
 */
export interface Vehicule {
  id: string;
  matricule: string;
  marque: string;
  /** Capacité maximale en kg */
  capaciteMax: number;
  /** Poids à vide en kg */
  poidsVide: number;
  /** Statut actuel de véhicule */
  statut: StatutVehicule;
  /** Type de déchet aue le véhicule collecte */
  typeDechet: TypeDechet;
}

/**
 * DTO pour la création/modification d'un véhicule
 */
export interface CreateVehiculeDto {
  capaciteMax: number;
  marque: string;
  matricule: string;
  poidsVide: number;
  typeDechet: TypeDechet;
}
