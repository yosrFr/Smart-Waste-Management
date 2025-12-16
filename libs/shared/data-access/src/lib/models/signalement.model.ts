import { TypeNotif } from '../enums';
import { GeoPoint } from '../interfaces';

/**
 * DTO pour signaler un conteneur endommagé
 */
export interface SignalerEndommageDto {
  date: string;
  description: string;
  type: TypeNotif;
  pointDeCollecteId: string;
}

/**
 * DTO pour signaler un véhicule en panne
 */
export interface SignalerVehiculePanneDto {
  date: string;
  description: string;
  type: TypeNotif;
  vehiculeId: string;
  localisation: GeoPoint;
}

/**
 * DTO pour signaler un incident sur le trajet
 */
export interface SignalerIncidentDto {
  date: string;
  description: string;
  type: TypeNotif;
  localisation: GeoPoint;
}
