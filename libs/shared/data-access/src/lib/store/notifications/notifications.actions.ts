/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import { CreateNotificationDto, AppNotification } from '../../models';

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
 * Créer une notification
 */
export const createNotification = createAction(
  '[Notifications] Create Notification',
  props<{ dto: CreateNotificationDto }>()
);

/**
 * Notification créée avec succès
 */
export const createNotificationSuccess = createAction(
  '[Notifications] Create Notification Success',
  props<{ notification: AppNotification }>()
);

/**
 * Action de création de notification échouée
 */
export const createNotificationFailure = createAction(
  '[Notifications] Create Notification Failure',
  props<{ error: string }>()
);

/**
 * Définir l'index de la page
 */
export const setPageIndex = createAction(
  '[Notifications] Set Page Index',
  props<{ pageIndex: number }>()
);
