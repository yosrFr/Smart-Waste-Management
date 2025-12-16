/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from './notifications.reducer';
import {
  EntityMap,
  mapNotificationToApp,
} from '../../mapper/notification.mapper';
import {
  AppNotification,
  PointDeCollecte,
  Tournee,
  Vehicule,
} from '../../models';

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

export const selectVehiculesEntities =
  createFeatureSelector<EntityMap<Vehicule>>('vehicules');
export const selectPointsCollecteEntities =
  createFeatureSelector<EntityMap<PointDeCollecte>>('pointsCollecte');
export const selectTourneesEntities =
  createFeatureSelector<EntityMap<Tournee>>('tournees');

export const selectAppNotifications = createSelector(
  selectAllNotifications,
  selectVehiculesEntities,
  selectPointsCollecteEntities,
  selectTourneesEntities,
  (notifications, vehicules, pointsCollecte, tournees) => {
    // console.log('Notifications dans le store:', notifications);
    // console.log('Notifications Véhicules dans le store:', vehicules);
    // console.log(
    //   'Notifications Points de collecte dans le store:',
    //   pointsCollecte
    // );
    // console.log('Notifications Tournees dans le store:', tournees);

    return notifications
      .map((n) =>
        mapNotificationToApp(n, {
          vehicules,
          pointsCollecte,
          tournees,
        })
      )
      .filter((n): n is AppNotification => {
        // console.log('Notification filtrée:', n);
        return n !== null;
      });
  }
);

/**
 * Sélectionne les 5 dernières notifications (pour le header)
 */
export const selectRecentNotifications = createSelector(
  selectAppNotifications,
  (notifications) => notifications.slice(0, 5)
);

/**
 * Sélectionne les notifications paginées
 */
export const selectPaginatedNotifications = createSelector(
  selectAppNotifications,
  selectNotificationPageIndex,
  (notifications, pageIndex) => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    // console.log('Notifications paginées:', notifications.slice(start, end));
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
