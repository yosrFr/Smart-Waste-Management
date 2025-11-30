/* eslint-disable @nx/enforce-module-boundaries */
import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './auth';
import * as fromNotifications from './notifications';

/**
 * Interface représentant l'état global de l'application
 */
export interface AppState {
  auth: fromAuth.AuthState;
  notifications: fromNotifications.NotificationState;
}

/**
 * Map des reducers pour chaque slice du store
 */
export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  notifications: fromNotifications.notificationReducer,
};

/**
 * Export de tous les effects
 */
export const effects = [
  fromAuth.AuthEffects,
  fromNotifications.NotificationEffects,
];

/**
 * Export de tous les selectors
 */
export * from './auth/auth selectors';
export * from './notifications/notifications.selectors';
