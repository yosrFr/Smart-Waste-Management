/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { Notification } from '../../models';
import * as NotificationActions from './notifications.actions';

/**
 * État des notifications
 */
export interface NotificationState {
  /** Liste de toutes les notifications */
  notifications: Notification[];
  /** Indique si un chargement est en cours */
  loading: boolean;
  /** Message d'erreur */
  error: string | null;
  /** Index de la page actuelle (pour pagination) */
  pageIndex: number;
  /** Nombre d'éléments par page */
  pageSize: number;
}

/**
 * État initial
 */
export const initialNotifState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
  pageIndex: 0,
  pageSize: 20,
};

/**
 * Reducer pour les notifications
 */
export const notificationReducer = createReducer(
  initialNotifState,
  // Load
  on(NotificationActions.loadNotifications, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(NotificationActions.loadNotificationsSuccess, (state, { notifications }) => ({
    ...state,
    notifications,
    loading: false,
  })),
  on(NotificationActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Add (utilisé par le simulateur)
  on(NotificationActions.addNotification, (state, { notification }) => ({
    ...state,
    notifications: [notification, ...state.notifications],
  })),
  // Create Success
  on(NotificationActions.createNotificationSuccess, (state, { notification }) => ({
    ...state,
    notifications: [notification, ...state.notifications],
  })),
  // Pagination
  on(NotificationActions.setPageIndex, (state, { pageIndex }) => ({
    ...state,
    pageIndex,
  })),
  on(NotificationActions.setPageSize, (state, { pageSize }) => ({
    ...state,
    pageSize,
    pageIndex: 0, // Reset à la première page
  }))
);
