import { StatutTournee } from '../enums';
import { GeoPoint } from '../interfaces';
import { PointDeCollecte } from './point-de-collecte.model';
import { Employe } from './utilisateur.model';
import { Vehicule } from './vehicule.model';

/**
 * Modèle pour une tournée de collecte
 */
export interface Tournee {
  id: string;
  /** Date et heure de début estimées */
  dateDebut: Date;
  /** Date et heure de fin estimées */
  dateFin: Date;
  /** Statut actuel de la tournée */
  statut: StatutTournee;
  /** Véhicule assignée à la tournée */
  vehiculeId: string;
  vehicule?: Vehicule;
  /** Employé assigné à la tournée */
  employeId: string;
  employe?: Employe;
  /** Liste des points de collecte à visiter */
  pointsDeCollecte?: PointDeCollecte[];
  pointsDeCollecteIds: string[];
  /** Position GPS actuelle de véhicule mise à jours en temps réel */
  positionActuelle?: GeoPoint;
}
