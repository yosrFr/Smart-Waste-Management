/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { PointDeCollecte } from '../../models';
import * as PointsCollecteActions from './points-de-collecte.actions';

export interface PointCollecteState {
  points: PointDeCollecte[];
  loading: boolean;
  error: string | null;
}

export const initialState: PointCollecteState = {
  points: [],
  loading: false,
  error: null,
};

export const pointCollecteReducer = createReducer(
  initialState,
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
  on(PointsCollecteActions.createPointCollecteSuccess, (state, { point }) => ({
    ...state,
    points: [...state.points, point],
  })),
  on(PointsCollecteActions.updatePointCollecteSuccess, (state, { point }) => ({
    ...state,
    points: state.points.map((p) => (p.id === point.id ? point : p)),
  })),
  on(PointsCollecteActions.deletePointCollecteSuccess, (state, { id }) => ({
    ...state,
    points: state.points.filter((p) => p.id !== id),
  })),
  on(
    PointsCollecteActions.refreshPointsCollecteSuccess,
    (state, { points }) => ({
      ...state,
      points,
    })
  )
);
