import { EtatConteneur, TypeDechet } from '../enums';
import { GeoPoint } from '../interfaces';

export interface PointDeCollecte {
  id: string;
  localisation: GeoPoint;
  /** Type de déchet aue le véhicule collecte */
  typeDechet: TypeDechet;
  /** Niveau de remplissage de conteneur en pourcent (0-100%) */
  niveauRemplissage: number;
  /** Etat actuel du conteneur */
  etatConteneur: EtatConteneur;
  /** Capacité d'un conteneur en Kg */
  capacite: number;

  tourneesIds: string[];
}
/**
 * DTO pour la création d'un point de collecte
 */
export interface CreatePointCollecteDto {
  localisation: GeoPoint;
  typeDechet: TypeDechet;
  capacite: number;
}

/**
 * DTO pour la modification d'un point de collecte
 */
export interface UpdatePointCollecteDto {
  localisation?: GeoPoint;
  typeDechet?: TypeDechet;
}
