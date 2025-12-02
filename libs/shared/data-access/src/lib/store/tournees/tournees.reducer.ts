/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { Tournee } from '../../models';
import * as TourneesActions from './tournees.actions';

/**
 * État des tournées
 */
export interface TourneeState {
  tournees: Tournee[];
  loading: boolean;
  error: string | null;
}

export const initialState: TourneeState = {
  tournees: [],
  loading: false,
  error: null,
};

export const tourneeReducer = createReducer(
  initialState,
  on(TourneesActions.loadTournees, (state) => ({
    ...state,
    loading: true,
  })),
  on(TourneesActions.loadTourneesSuccess, (state, { tournees }) => ({
    ...state,
    tournees,
    loading: false,
  })),
  on(TourneesActions.loadTourneesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
