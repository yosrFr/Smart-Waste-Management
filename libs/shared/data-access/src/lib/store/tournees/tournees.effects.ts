/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as TourneesActions from './tournees.actions';
import { TourneeService } from '../../services/tournee.service';

/**
 * Effects pour la gestion des tournées
 */
@Injectable()
export class TourneeEffects {
  private actions$ = inject(Actions);
  private tourneeService = inject(TourneeService);

  /**
   * Charger les tournées
   */
  loadTournees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TourneesActions.loadTournees),
      switchMap(() =>
        this.tourneeService.getAll().pipe(
          map((tournees) => TourneesActions.loadTourneesSuccess({ tournees })),
          catchError((error) =>
            of(TourneesActions.loadTourneesFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
