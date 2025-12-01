/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PointCollecteState } from './points-de-collecte.reducer';
import { EtatConteneur, TypeDechet } from '../../enums';

export const selectPointCollecteState =
  createFeatureSelector<PointCollecteState>('pointsCollecte');

export const selectAllPointsCollecte = createSelector(
  selectPointCollecteState,
  (state) => state.points
);

export const selectPointsPleins = createSelector(
  selectAllPointsCollecte,
  (points) => points.filter((p) => p.etat === EtatConteneur.PLEIN)
);

export const selectPointsEndommages = createSelector(
  selectAllPointsCollecte,
  (points) => points.filter((p) => p.etat === EtatConteneur.ENDOMMAGE)
);

export const selectPointsByType = (typeDechet: TypeDechet) =>
  createSelector(selectAllPointsCollecte, (points) =>
    points.filter((p) => p.typeDechet === typeDechet)
  );

export const selectPointsCollecteLoading = createSelector(
  selectPointCollecteState,
  (state) => state.loading
);
