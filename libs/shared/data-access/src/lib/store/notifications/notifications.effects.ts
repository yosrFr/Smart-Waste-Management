/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as NotificationActions from './notifications.actions';
import { NotificationService, SignalementService } from '../../services';
import { AppNotification } from '../../models';

/**
 * Effects pour les notifications
 */
@Injectable()
export class NotificationEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);
  private signalementService = inject(SignalementService);

  /**
   * Charge toutes les notifications
   */
  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      switchMap(() =>
        this.notificationService.getAll().pipe(
          map((notifications) =>
            NotificationActions.loadNotificationsSuccess({ notifications })
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
