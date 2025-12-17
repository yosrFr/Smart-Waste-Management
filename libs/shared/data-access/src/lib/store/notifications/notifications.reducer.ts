/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { AppNotification } from '../../models';
import * as NotificationActions from './notifications.actions';

/**
 * État des notifications
 */
export interface NotificationState {
  /** Liste de toutes les notifications */
  notifications: AppNotification[];
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
 * État initial des notifications
 */
export const initialNotifState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
  pageIndex: 0,
  pageSize: 10,
};

/**
 * Reducer pour les notifications
 */
export const notificationReducer = createReducer(
  initialNotifState,
  // Loading des notifications
  on(NotificationActions.loadNotifications, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  // on(
  //   NotificationActions.loadNotificationsSuccess,
  //   (state, { notifications }) => {
  //     if (!Array.isArray(notifications)) {
  //       console.error('Notifications incorrectes :', notifications);
  //       return {
  //         ...state,
  //         loading: false,
  //         error: 'Données des notifications invalides',
  //       };
  //     }
  //     console.log('Notifications mises à jour dans le store:', notifications);
  //     return {
  //       ...state,
  //       notifications: [...notifications],
  //       loading: false,
  //     };
  //   }
  // ),
  on(
    NotificationActions.loadNotificationsSuccess,
    (state, { notifications }) => ({
      ...state,
      notifications,
      loading: false,
    })
  ),
  // on(NotificationActions.loadNotificationsFailure, (state, { error }) => ({
  //   ...state,
  //   loading: false,
  //   error: typeof error === "string" ? error : "Une erreur inconnue est survenue",
  // })),
  on(NotificationActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Signalements qui créent des notifications
  on(NotificationActions.signalementSuccess, (state, { notification }) => ({
    ...state,
    notifications: [notification, ...state.notifications],
  })),
  on(NotificationActions.signalementFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Pagination des notifications
  on(NotificationActions.setPageIndex, (state, { pageIndex }) => ({
    ...state,
    pageIndex: pageIndex >= 0 ? pageIndex : state.pageIndex,
  }))
);
