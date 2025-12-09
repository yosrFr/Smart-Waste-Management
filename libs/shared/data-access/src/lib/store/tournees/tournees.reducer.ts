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
/**
 * État initial des tournées
 */
export const initialTourneeState: TourneeState = {
  tournees: [],
  loading: false,
  error: null,
};

/**
 * Reducer pour les tournées
 */
export const tourneeReducer = createReducer(
  initialTourneeState,
  // Loading des tournées
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
  })),
  // Mise à jour de la position d'un véhicule dans une tournée
  on(TourneesActions.updateTourneePosition, (state, { id, position }) => ({
    ...state,
    tournees: state.tournees.map((t) =>
      t.id === id ? { ...t, positionActuelle: position } : t
    ),
  }))
);
