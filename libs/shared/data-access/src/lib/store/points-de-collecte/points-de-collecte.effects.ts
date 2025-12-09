/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, interval } from 'rxjs';
import { map, catchError, switchMap, startWith } from 'rxjs/operators';
import * as PointsCollecteActions from './points-de-collecte.actions';
import { PointCollecteService } from '../../services/point-de-collecte.service';

/**
 * Effects pour la gestion des points de collecte
 */
@Injectable()
export class PointCollecteEffects {
  private actions$ = inject(Actions);
  private pointCollecteService = inject(PointCollecteService);

  /**
   * Charger les points de collecte
   */
  loadPointsCollecte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsCollecteActions.loadPointsCollecte),
      switchMap(() =>
        this.pointCollecteService.getAll().pipe(
          map((points) =>
            PointsCollecteActions.loadPointsCollecteSuccess({ points })
          ),
          catchError((error) =>
            of(
              PointsCollecteActions.loadPointsCollecteFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  /**
   * Créer un point de collecte
   */
  createPointCollecte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsCollecteActions.createPointCollecte),
      switchMap(({ dto }) =>
        this.pointCollecteService.create(dto).pipe(
          map((point) =>
            PointsCollecteActions.createPointCollecteSuccess({ point })
          ),
          catchError((error) =>
            of(
              PointsCollecteActions.createPointCollecteFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  /**
   * Mettre à jour un point de collecte
   */
  updatePointCollecte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsCollecteActions.updatePointCollecte),
      switchMap(({ id, dto }) =>
        this.pointCollecteService.update(id, dto).pipe(
          map((point) =>
            PointsCollecteActions.updatePointCollecteSuccess({ point })
          ),
          catchError((error) =>
            of(
              PointsCollecteActions.updatePointCollecteFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  /**
   * Supprimer un point de collecte
   */
  deletePointCollecte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsCollecteActions.deletePointCollecte),
      switchMap(({ id }) =>
        this.pointCollecteService.delete(id).pipe(
          map(() => PointsCollecteActions.deletePointCollecteSuccess({ id })),
          catchError((error) =>
            of(
              PointsCollecteActions.deletePointCollecteFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  /**
   * Rafraîchit les niveaux toutes les 5 secondes
   */
  refreshPointsCollecte$ = createEffect(() =>
    interval(5000).pipe(
      startWith(0),
      switchMap(() =>
        this.pointCollecteService.getAll().pipe(
          map((points) =>
            PointsCollecteActions.refreshPointsCollecteSuccess({ points })
          ),
          catchError((error) =>
            of(
              PointsCollecteActions.refreshPointsCollecteFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );
}
