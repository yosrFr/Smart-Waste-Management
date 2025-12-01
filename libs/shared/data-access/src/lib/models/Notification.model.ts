import { EtatConteneur, TypeDechet, TypeNotif } from '../enums';
import { GeoPoint } from '../interfaces';

/**
 * Modèle de base d'une notification
 */
export interface NotificationBase {
  id: string;
  /** Date et heure de création */
  date: string;
  /** Description de la notification */
  description: string;
  /** Type de notification */
  type: TypeNotif;
}

/**
 * Détails spécifiques pour une notification de conteneur plein
 */
export interface NotificationConteneurPleinDetails {
  localisation: GeoPoint;
  typeConteneur: TypeDechet;
  etat: EtatConteneur;
}

/**
 * Notification de conteneur plein
 */
export interface NotificationConteneurPlein extends NotificationBase {
  type: TypeNotif.PLEIN;
  details: NotificationConteneurPleinDetails;
}

/**
 * Détails spécifiques pour une notification de conteneur endommagé
 */
export interface NotificationConteneurEndommageDetails {
  localisation: GeoPoint;
  typeConteneur: TypeDechet;
}

/**
 * Notification de conteneur endommagé
 */
export interface NotificationConteneurEndommage extends NotificationBase {
  type: TypeNotif.ENDOMMAGE;
  details: NotificationConteneurEndommageDetails;
}

/**
 * Détails spécifiques pour une notification de véhicule en panne
 */
export interface NotificationVehiculeEnPanneDetails {
  matricule: string;
  typeDechet: TypeDechet;
}

/**
 * Notification de véhicule en panne
 */
export interface NotificationVehiculeEnPanne extends NotificationBase {
  type: TypeNotif.PANNE;
  details: NotificationVehiculeEnPanneDetails;
}

/**
 * Détails spécifiques pour une notification d'incident sur le trajet
 */
export interface NotificationIncidentDetails {
  localisation: GeoPoint;
}

/**
 * Notification d'incident sur le trajet
 */
export interface NotificationIncident extends NotificationBase {
  type: TypeNotif.INCIDENT;
  details: NotificationIncidentDetails;
}

/**
 * Détails spécifiques pour une notification de nouvelle tâche
 */
export interface NotificationNouvelleTacheDetails {
  tourneeId: string;
  dateDebut: string;
  dateFin: string;
  vehiculeMatricule: string;
  nombrePoints: number;
}

/**
 * Notification de nouvelle tâche/tournée
 */
export interface NotificationNouvelleTache extends NotificationBase {
  type: TypeNotif.NOUVELLE_TACHE;
  details: NotificationNouvelleTacheDetails;
}

/**
 * Union type pour toutes les notifications
 */
export type Notification =
  | NotificationConteneurPlein
  | NotificationConteneurEndommage
  | NotificationVehiculeEnPanne
  | NotificationIncident
  | NotificationNouvelleTache;

/**
 * DTO pour créer une notification
 */
export interface CreateNotificationDto {
  type: TypeNotif;
  date: string;
  description: string;
  details:
    | NotificationConteneurPleinDetails
    | NotificationConteneurEndommageDetails
    | NotificationVehiculeEnPanneDetails
    | NotificationIncidentDetails
    | NotificationNouvelleTacheDetails;
}
