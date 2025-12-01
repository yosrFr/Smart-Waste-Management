import { TypeDechet } from '../enums';
import { GeoPoint } from '../interfaces';

/**
 * DTO pour signaler un conteneur endommagé
 */
export interface SignalerEndommageDto {
  localisation: GeoPoint;
  typeDechet: TypeDechet;
}

/**
 * DTO pour signaler un véhicule en panne
 */
export interface SignalerVehiculePanneDto {
  matricule: string;
  typeDechet: TypeDechet;
}

/**
 * DTO pour signaler un incident sur le trajet
 */
export interface SignalerIncidentDto {
  localisation: GeoPoint;
}
