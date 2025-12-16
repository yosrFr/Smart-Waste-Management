import { TypeDechet, TypeNotif } from '../enums';
import { GeoPoint } from '../interfaces';

export interface NotificationBase {
  id: string;
  date: string;
  description: string;
  type: TypeNotif;
}

export interface NotificationConteneurPlein extends NotificationBase {
  type: TypeNotif.PLEIN;
  pointDeCollecteId: string;
}

export interface NotificationIncident extends NotificationBase {
  type: TypeNotif.INCIDENT;
  localisation: GeoPoint;
}

export interface NotificationNouvelleTache extends NotificationBase {
  type: TypeNotif.NOUVELLE_TACHE;
  tourneeId: string;
  employeId: string;
  vehiculeId: string;
}

export interface NotificationPanneVehicule extends NotificationBase {
  type: TypeNotif.PANNE_VEHICULE;
  vehiculeId: string;
  localisation: GeoPoint;
}

export interface NotificationConteneurEndommage extends NotificationBase {
  type: TypeNotif.ENDOMMAGE;
  pointDeCollecteId: string;
}

export type ApiNotification =
  | NotificationConteneurPlein
  | NotificationConteneurEndommage
  | NotificationIncident
  | NotificationPanneVehicule
  | NotificationNouvelleTache;

/**
 * Détails spécifiques pour une notification de conteneur plein
 */
export interface NotificationConteneurPleinDetails {
  localisation: GeoPoint;
  typeConteneur: TypeDechet;
  niveauRemplissage: number;
}

/**
 * Détails spécifiques pour une notification de conteneur endommagé
 */
export interface NotificationConteneurEndommageDetails {
  localisation: GeoPoint;
  typeConteneur: TypeDechet;
}

/**
 * Détails spécifiques pour une notification de véhicule en panne
 */
export interface NotificationVehiculeEnPanneDetails {
  matricule: string;
  typeDechet: TypeDechet;
}

/**
 * Détails spécifiques pour une notification d'incident sur le trajet
 */
export interface NotificationIncidentDetails {
  localisation: GeoPoint;
}

/**
 * Détails spécifiques pour une notification de nouvelle tâche
 */
export interface NotificationNouvelleTacheDetails {
  nbPointCollecte: number;
  dateDebut: Date;
  dateFin: Date;
  vehiculeMatricule: string;
}

export type AppNotification =
  | (NotificationConteneurPlein & {
      details: NotificationConteneurPleinDetails;
    })
  | (NotificationConteneurEndommage & {
      details: NotificationConteneurEndommageDetails;
    })
  | (NotificationPanneVehicule & {
      details: NotificationVehiculeEnPanneDetails;
    })
  | (NotificationIncident & {
      details: NotificationIncidentDetails;
    })
  | (NotificationNouvelleTache & {
      details: NotificationNouvelleTacheDetails;
    });
