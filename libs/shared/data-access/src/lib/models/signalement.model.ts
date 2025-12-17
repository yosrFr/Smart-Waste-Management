import { GeoPoint } from '../interfaces';

/**
 * DTO pour signaler un conteneur endommagé
 */
export interface SignalerEndommageDto {
  pointDeCollecteId: string;
}

/**
 * DTO pour signaler un véhicule en panne
 */
export interface SignalerVehiculePanneDto {
  vehiculeId: string;
  localisation: GeoPoint;
}

/**
 * DTO pour signaler un incident sur le trajet
 */
export interface SignalerIncidentDto {
  localisation: GeoPoint;
}
