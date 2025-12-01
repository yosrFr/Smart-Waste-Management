/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as NotificationActions from './notifications.actions';
import { NotificationService } from '../../services';

/**
 * Effects pour les notifications
 */
@Injectable()
export class NotificationEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);

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
   * Crée une nouvelle notification
   */
  createNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.createNotification),
      switchMap(({ dto }) =>
        this.notificationService.create(dto).pipe(
          map((notification) =>
            NotificationActions.createNotificationSuccess({ notification })
          ),
          catchError(() => of({ type: 'NO_ACTION' }))
        )
      )
    )
  );
}
