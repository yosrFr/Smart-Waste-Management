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
  /** Index de la page actuelle (pour pagination) */
  pageIndex: number;
  /** Nombre d'éléments par page */
  pageSize: number;
}

/**
 * État initial
 */
export const initialState: NotificationState = {
  notifications: [],
  pageIndex: 0,
  pageSize: 20,
};

/**
 * Reducer pour les notifications
 */
export const notificationReducer = createReducer(
  initialState,
  on(NotificationActions.setNotifications, (state, { notifications }) => ({
    ...state,
    notifications,
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
