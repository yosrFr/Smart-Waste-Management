/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, of } from 'rxjs';
import { map, catchError, switchMap, mergeMap, tap } from 'rxjs/operators';
import * as NotificationActions from './notifications.actions';
import { NotificationService, SignalementService } from '../../services';
import { AppNotification } from '../../models';
import { select, Store } from '@ngrx/store';
import { selectAllTournees } from '../tournees';
import { selectAllVehicules } from '../vehicules';
import { selectAllPointsCollecte } from '../points-de-collecte';

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
          mergeMap(([tournees, vehicules, points]) =>
            this.notificationService.getAll().pipe(
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
