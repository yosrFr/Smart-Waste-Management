/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from './notifications.reducer';

/**
 * Taille de page fixe pour la pagination
 */
const pageSize = 10;

/**
 * Sélecteur pour le feature state notifications
 */
export const selectNotificationState =
  createFeatureSelector<NotificationState>('notifications');

/**
 * Sélectionne l'état de chargement
 */
export const selectNotificationsLoading = createSelector(
  selectNotificationState,
  (state) => state.loading
);

/**
 * Sélectionne toutes les notifications
 */
export const selectAllNotifications = createSelector(
  selectNotificationState,
  (state) => state.notifications
);

/**
 * Sélectionne l'index de page actuel
 */
export const selectNotificationPageIndex = createSelector(
  selectNotificationState,
  (state) => state.pageIndex
);

/**
 * Sélectionne les 5 dernières notifications (pour le header)
 */
export const selectRecentNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.slice(0, 5)
);

/**
 * Sélectionne les notifications paginées
 */
export const selectPaginatedNotifications = createSelector(
  selectAllNotifications,
  selectNotificationPageIndex,
  (notifications, pageIndex) => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return notifications.slice(start, end);
  }
);

/**
 * Sélectionne le nombre total de pages
 */
export const selectNotificationTotalPages = createSelector(
  selectAllNotifications,
  (notifications) => Math.ceil(notifications.length / pageSize)
);
