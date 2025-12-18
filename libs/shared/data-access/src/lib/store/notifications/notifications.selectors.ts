/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from './notifications.reducer';
// import {
//   EntityMap,
//   mapNotificationToApp,
// } from '../../mapper/notification.mapper';
// import {
//   AppNotification,
//   PointDeCollecte,
//   Tournee,
//   Vehicule,
// } from '../../models';

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

// export const selectVehiculesEntities = createSelector(
//   createFeatureSelector<any>('vehicules'),
//   (state): EntityMap<Vehicule> => {
//     console.log('State Vehicule:', state);
//     if (!state || !Array.isArray(state.vehicules)) {
//       console.log('Véhicules manquants ou invalides dans le store', state);
//       return {}; // Si "vehicules" est undefined ou non un tableau, retourner un objet vide
//     }

//     return state.vehicules.reduce((acc: EntityMap<Vehicule>, v: Vehicule) => {
//       if (v && v.id) acc[v.id] = v;
//       return acc;
//     }, {});
//   }
// );

// export const selectPointsCollecteEntities = createSelector(
//   createFeatureSelector<any>('pointsCollecte'),
//   (state): EntityMap<PointDeCollecte> => {
//     console.log('State Points de Collecte:', state);
//     if (!state || !Array.isArray(state.points)) {
//       console.log('Points manquants ou invalides dans le store', state);
//       return {};
//     }
//     return state.pointsCollecte.reduce(
//       (acc: EntityMap<PointDeCollecte>, p: PointDeCollecte) => {
//         if (p && p.id) acc[p.id] = p;
//         return acc;
//       },
//       {}
//     );
//   }
// );

// export const selectTourneesEntities = createSelector(
//   createFeatureSelector<any>('tournees'),
//   (state): EntityMap<Tournee> => {
//     console.log('State Tournee:', state);
//     if (!state || !Array.isArray(state.tournees)) {
//       console.log('Tournee manquants ou invalides dans le store', state);
//       return {};
//     }
//     return state.tournees.reduce((acc: EntityMap<Tournee>, t: Tournee) => {
//       if (t && t.id) acc[t.id] = t;
//       return acc;
//     }, {});
//   }
// );

// export const selectAppNotifications = createSelector(
//   selectAllNotifications,
//   selectVehiculesEntities,
//   selectPointsCollecteEntities,
//   selectTourneesEntities,
//   (notifications, vehicules, pointsCollecte, tournees) => {
//     console.log('Notifications dans le store:', notifications);
//     console.log('Notifications Véhicules dans le store:', vehicules);
//     console.log(
//       'Notifications Points de collecte dans le store:',
//       pointsCollecte
//     );
//     console.log('Notifications Tournees dans le store:', tournees);

//     return notifications
//       .map((n) =>
//         mapNotificationToApp(n, {
//           vehicules,
//           pointsCollecte,
//           tournees,
//         })
//       )
//       .filter((n): n is AppNotification => {
//         console.log('Notification filtrée:', n);
//         return n !== null;
//       });
//   }
// );

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
