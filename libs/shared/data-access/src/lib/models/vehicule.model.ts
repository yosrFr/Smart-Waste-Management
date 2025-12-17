import { StatutVehicule, TypeDechet } from '../enums';

/**
 * Modèle pour un véhicule de collecte
 */
export interface Vehicule {
  id: string;
  matricule: string;
  marque: string;
  /** Capacité maximale en kg */
  capacite: number;
  /** Poids à vide en kg */
  poidsVide: number;
  /** Statut actuel de véhicule */
  statutVehicule: StatutVehicule;
  /** Type de déchet aue le véhicule collecte */
  typeDechet: TypeDechet;

  tourneesIds: string[];
}

/**
 * DTO pour la création d'un véhicule
 */
export interface CreateVehiculeDto {
  capacite: number;
  marque: string;
  matricule: string;
  poidsVide: number;
  typeDechet: TypeDechet;
}

/**
 * DTO pour la modification d'un véhicule
 */
export interface UpdateVehiculeDto {
  capacite: number;
  poidsVide: number;
  typeDechet: TypeDechet;
}
