/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import {
  AppNotification,
  SignalerEndommageDto,
  SignalerIncidentDto,
  SignalerVehiculePanneDto,
} from '../../models';

/**
 * Actions pour les notifications
 */

/**
 * Charger les notifications
 */
export const loadNotifications = createAction(
  '[Notifications] Load Notifications'
);

/**
 * Notifications chargées avec succès
 */
export const loadNotificationsSuccess = createAction(
  '[Notifications] Load Notifications Success',
  props<{ notifications: AppNotification[] }>()
);

/**
 * Échec du chargement des notifications
 */
export const loadNotificationsFailure = createAction(
  '[Notifications] Load Notifications Failure',
  props<{ error: string }>()
);

/**
 * Signaler un conteneur endommagé
 */
export const signalerConteneur = createAction(
  '[Signalement] Signaler Conteneur',
  props<{ dto: SignalerEndommageDto }>()
);

/**
 * Signaler un véhicule en panne
 */
export const signalerVehicule = createAction(
  '[Signalement] Signaler Véhicule',
  props<{ dto: SignalerVehiculePanneDto }>()
);

/**
 * Signaler un incident sur le trajet
 */
export const signalerIncident = createAction(
  '[Signalement] Signaler Incident',
  props<{ dto: SignalerIncidentDto }>()
);

/**
 * Signalements réussis
 */
export const signalementSuccess = createAction(
  '[Signalement] Signalement Success',
  props<{ notification: AppNotification }>()
);

/**
 * Echec de signalement
 */
export const signalementFailure = createAction(
  '[Signalement] Signalement Failure',
  props<{ error: string }>()
);

/**
 * Définir l'index de la page
 */
export const setPageIndex = createAction(
  '[Notifications] Set Page Index',
  props<{ pageIndex: number }>()
);
