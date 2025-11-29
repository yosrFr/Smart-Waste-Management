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
          catchError((() => of({ type: 'NO_ACTION' }))
          )
        )
      )
    )
  );
}
