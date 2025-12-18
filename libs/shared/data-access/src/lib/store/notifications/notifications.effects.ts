/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, of } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  withLatestFrom,
  mergeMap,
  take,
  tap,
} from 'rxjs/operators';
import * as NotificationActions from './notifications.actions';
import { NotificationService, SignalementService } from '../../services';
import { ApiNotification, AppNotification } from '../../models';
import { select, Store } from '@ngrx/store';
import { selectAllTournees } from '../tournees';
import { selectAllVehicules } from '../vehicules';
import { selectAllPointsCollecte } from '../points-de-collecte';
// import { mapNotificationToApp } from '../../mapper/notification.mapper';
// import {
//   selectPointsCollecteEntities,
//   selectTourneesEntities,
//   selectVehiculesEntities,
// } from './notifications.selectors';
// import { TypeNotif } from '../../enums';

/**
 * Effects pour les notifications
 */
@Injectable()
export class NotificationEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);
  private signalementService = inject(SignalementService);
  private store = inject(Store);

  /**
   * Charge toutes les notifications
   */
  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      mergeMap(() =>
        combineLatest([
          this.store.pipe(select(selectAllTournees)),
          this.store.pipe(select(selectAllVehicules)),
          this.store.pipe(select(selectAllPointsCollecte)),
        ]).pipe(
          tap(([tournees, vehicules, points]) => {
            // console.log('Données récupérées du store:');
            // console.log('Tournees:', tournees);
            // console.log('Vehicules:', vehicules);
            // console.log('Points de collecte:', points);
          }),
          mergeMap(([tournees, vehicules, points]) =>
            this.notificationService.getAll().pipe(
              tap((notifications) => {
                // console.log('Notifications récupérées:', notifications);
              }),
              map((notifications) =>
                notifications.map((notif) =>
                  this.notificationService.enrichNotifications(
                    notif,
                    tournees,
                    vehicules,
                    points
                  )
                )
              ),
              tap((enrichedNotifications) => {
                // console.log('Notifications enrichies:', enrichedNotifications);
              }),
              map((notifications) =>
                NotificationActions.loadNotificationsSuccess({
                  notifications,
                })
              ),
              catchError((error) =>
                of(
                  NotificationActions.loadNotificationsFailure({
                    error: error.message,
                  })
                )
              )
            )
          )
        )
      )
    )
  );

  // loadNotifications$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(NotificationActions.loadNotifications),
  //     withLatestFrom(
  //       this.store.select(selectVehiculesEntities),
  //       this.store.select(selectPointsCollecteEntities),
  //       this.store.select(selectTourneesEntities)
  //     ),
  //     switchMap(([_, vehicules, pointsCollecte, tournees]) => {
  //       // Vérifier si toutes les entités sont disponibles
  //       if (!vehicules || !tournees || !pointsCollecte) {
  //         console.log(
  //           'Les entités nécessaires (tournées ou véhicules) ne sont pas disponibles.'
  //         );
  //         return of(
  //           NotificationActions.loadNotificationsFailure({
  //             error: 'Les entités nécessaires ne sont pas disponibles.',
  //           })
  //         );
  //       }

  //       return this.notificationService.getAll().pipe(
  //         map((apiNotifications) => {
  //           const appNotifications: AppNotification[] = apiNotifications
  //             .map((n) =>
  //               mapNotificationToApp(n, { vehicules, pointsCollecte, tournees })
  //             )
  //             .filter((n): n is AppNotification => n !== null);

  //           return NotificationActions.loadNotificationsSuccess({
  //             notifications: appNotifications,
  //           });
  //         }),
  //         catchError((error) =>
  //           of(
  //             NotificationActions.loadNotificationsFailure({
  //               error:
  //                 error.message ||
  //                 'Erreur lors du chargement des notifications',
  //             })
  //           )
  //         )
  //       );
  //     })
  //   )
  // );

  /**
   * Signaler un conteneur endommagé
   */
  signalerConteneur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.signalerConteneur),
      switchMap(({ dto }) =>
        this.signalementService.signalerConteneur(dto).pipe(
          map((notification: AppNotification) =>
            NotificationActions.signalementSuccess({ notification })
          ),
          catchError((error) =>
            of(NotificationActions.signalementFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Signaler un véhicule en panne
   */
  signalerVehicule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.signalerVehicule),
      switchMap(({ dto }) =>
        this.signalementService.signalerVehicule(dto).pipe(
          map((notification: AppNotification) =>
            NotificationActions.signalementSuccess({ notification })
          ),
          catchError((error) =>
            of(NotificationActions.signalementFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Signaler un incident
   */
  signalerIncident$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.signalerIncident),
      switchMap(({ dto }) =>
        this.signalementService.signalerIncident(dto).pipe(
          map((notification: AppNotification) =>
            NotificationActions.signalementSuccess({ notification })
          ),
          catchError((error) =>
            of(NotificationActions.signalementFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
