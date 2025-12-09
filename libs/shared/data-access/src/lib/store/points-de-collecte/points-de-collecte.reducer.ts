/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { PointDeCollecte } from '../../models';
import * as PointsCollecteActions from './points-de-collecte.actions';

/**
 * Etat des points de collecte
 */
export interface PointCollecteState {
  points: PointDeCollecte[];
  loading: boolean;
  error: string | null;
}

/**
 * Etat initial des points de collecte
 */
export const initialPointCollecteState: PointCollecteState = {
  points: [],
  loading: false,
  error: null,
};

/**
 * Reducer pour les points de collecte
 */
export const pointCollecteReducer = createReducer(
  initialPointCollecteState,
  // Loading des points de collecte
  on(PointsCollecteActions.loadPointsCollecte, (state) => ({
    ...state,
    loading: true,
  })),
  on(PointsCollecteActions.loadPointsCollecteSuccess, (state, { points }) => ({
    ...state,
    points,
    loading: false,
  })),
  on(PointsCollecteActions.loadPointsCollecteFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Cr"ation d'un point de collecte
  on(PointsCollecteActions.createPointCollecteSuccess, (state, { point }) => ({
    ...state,
    points: [...state.points, point],
  })),
  on(PointsCollecteActions.createPointCollecteFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Update d'un point de collecte
  on(PointsCollecteActions.updatePointCollecteSuccess, (state, { point }) => ({
    ...state,
    points: state.points.map((p) => (p.id === point.id ? point : p)),
  })),
  on(PointsCollecteActions.updatePointCollecteFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Suppression d'un point de collecte
  on(PointsCollecteActions.deletePointCollecteSuccess, (state, { id }) => ({
    ...state,
    points: state.points.filter((p) => p.id !== id),
  })),
  on(PointsCollecteActions.deletePointCollecteFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Mettre à jour le niveau de remplisaage d'un point de collecte
  on(
    PointsCollecteActions.refreshPointsCollecteSuccess,
    (state, { points }) => ({
      ...state,
      points,
    })
  ),
  on(
    PointsCollecteActions.refreshPointsCollecteFailure,
    (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })
  )
);
