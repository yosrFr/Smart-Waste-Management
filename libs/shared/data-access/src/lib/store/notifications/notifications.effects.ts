/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import * as NotificationActions from './notifications.actions';
import { NotificationService, SignalementService } from '../../services';
import { ApiNotification, AppNotification } from '../../models';
import { Store } from '@ngrx/store';
import { mapNotificationToApp } from '../../mapper/notification.mapper';
import {
  selectPointsCollecteEntities,
  selectTourneesEntities,
  selectVehiculesEntities,
} from './notifications.selectors';
import { TypeNotif } from '../../enums';

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
      switchMap(() =>
        this.notificationService.getAll().pipe(
          withLatestFrom(
            this.store.select(selectVehiculesEntities),
            this.store.select(selectPointsCollecteEntities),
            this.store.select(selectTourneesEntities)
          ),
          map(([apiNotifications, vehicules, pointsCollecte, tournees]) => {
            // Vérification si les entités sont vides
            if (!vehicules || !pointsCollecte || !tournees) {
              // console.log('Entités nécessaires non chargées dans le store');
              return NotificationActions.loadNotificationsFailure({
                error: 'Données nécessaires non disponibles',
              });
            }
            // console.log("Notifications reçues de l'API:", apiNotifications);
            const appNotifications: AppNotification[] = apiNotifications
              .map((n) => {
                // Vérification du contexte en fonction du type de notification
                if (n.type === TypeNotif.PLEIN && !pointsCollecte) return null;
                if (n.type === TypeNotif.ENDOMMAGE && !pointsCollecte)
                  return null;
                if (n.type === TypeNotif.PANNE_VEHICULE && !vehicules)
                  return null;
                if (
                  n.type === TypeNotif.NOUVELLE_TACHE &&
                  (!tournees || !vehicules)
                )
                  return null;

                // Choisir le contexte approprié
                let context: any;
                switch (n.type) {
                  case TypeNotif.PLEIN:
                  case TypeNotif.ENDOMMAGE:
                    context = { pointsCollecte };
                    break;
                  case TypeNotif.PANNE_VEHICULE:
                    context = { vehicules };
                    break;
                  case TypeNotif.NOUVELLE_TACHE:
                    context = { tournees, vehicules };
                    break;
                  default:
                    context = {};
                }

                return mapNotificationToApp(n, context);
              })
              .filter((n): n is AppNotification => n !== null);

            // console.log('Notifications après mapping:', appNotifications);

            return NotificationActions.loadNotificationsSuccess({
              notifications: appNotifications,
            });
          }),
          catchError((error) =>
            of(
              NotificationActions.loadNotificationsFailure({
                error:
                  error.message ||
                  'Erreur lors du chargement des notifications',
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
