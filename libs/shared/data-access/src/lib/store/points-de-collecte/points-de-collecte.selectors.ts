/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PointCollecteState } from './points-de-collecte.reducer';
import { EtatConteneur, TypeDechet } from '../../enums';

/**
 * Sélectionne l'état global des points de collecte dans le store
 */
export const selectPointCollecteState =
  createFeatureSelector<PointCollecteState>('pointsCollecte');

/**
 * Selectionne le statut de chargement des points de collecte
 */
export const selectPointsCollecteLoading = createSelector(
  selectPointCollecteState,
  (state) => state.loading
);

/**
 * Selectionne tous les points de collecte
 */
export const selectAllPointsCollecte = createSelector(
  selectPointCollecteState,
  (state) => state.points
);

/**
 * Selectionne un point de collecte par son ID
 * @param id id du point de collecte
 * @returns point de collecte correspondant
 */
export const selectPointsCollecteById = (id: string) =>
  createSelector(selectAllPointsCollecte, (points) =>
    points.find((p) => p.id === id)
  );

/**
 * Selectionne les points de collecte par état
 * @param etatConteneur etatConteneur du conteneur
 * @returns liste des points avec cet état
 */
export const selectPointsCollecteByEtat = (etatConteneur: EtatConteneur) =>
  createSelector(selectAllPointsCollecte, (points) =>
    points.filter((p) => p.etatConteneur === etatConteneur)
  );

/**
 * Selectionne les points de collecte par type de déchet
 * @param typeDechet type de déchet
 * @returns liste des points avec ce type de déchet
 */
export const selectPointsByTypeDechet = (typeDechet: TypeDechet) =>
  createSelector(selectAllPointsCollecte, (points) =>
    points.filter((p) => p.typeDechet === typeDechet)
  );

// export const selectPointsPleins = createSelector(
//   selectAllPointsCollecte,
//   (points) => points.filter((p) => p.etatConteneur === EtatConteneur.PLEIN)
// );

// export const selectPointsEndommages = createSelector(
//   selectAllPointsCollecte,
//   (points) => points.filter((p) => p.etatConteneur === EtatConteneur.ENDOMMAGE)
// );
