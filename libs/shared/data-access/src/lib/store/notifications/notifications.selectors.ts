/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from './notifications.reducer';

/**
 * Sélecteur pour le feature state notifications
 */
export const selectNotificationState =
  createFeatureSelector<NotificationState>('notifications');

/**
 * Sélectionne toutes les notifications
 */
export const selectAllNotifications = createSelector(
  selectNotificationState,
  (state) => state.notifications
);

/**
 * Sélectionne les 5 dernières notifications (pour le header)
 */
export const selectRecentNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.slice(0, 5)
);

/**
 * Sélectionne l'index de page actuel
 */
export const selectNotificationPageIndex = createSelector(
  selectNotificationState,
  (state) => state.pageIndex
);

/**
 * Sélectionne la taille de page
 */
export const selectNotificationPageSize = createSelector(
  selectNotificationState,
  (state) => state.pageSize
);

/**
 * Sélectionne les notifications paginées
 */
export const selectPaginatedNotifications = createSelector(
  selectAllNotifications,
  selectNotificationPageIndex,
  selectNotificationPageSize,
  (notifications, pageIndex, pageSize) => {
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
  selectNotificationPageSize,
  (notifications, pageSize) => Math.ceil(notifications.length / pageSize)
);
