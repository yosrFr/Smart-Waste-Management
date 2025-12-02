/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TourneeState } from './tournees.reducer';
import { StatutTournee } from '../../enums';

export const selectTourneeState =
  createFeatureSelector<TourneeState>('tournees');

export const selectAllTournees = createSelector(
  selectTourneeState,
  (state) => state.tournees
);

export const selectTourneesByStatut = (statut: StatutTournee) =>
  createSelector(selectAllTournees, (tournees) =>
    tournees.filter((t) => t.statut === statut)
  );

export const selectTourneesNonCommencees = createSelector(
  selectAllTournees,
  (tournees) => tournees.filter((t) => t.statut === StatutTournee.NON_COMMENCEE)
);

export const selectTourneesEnCours = createSelector(
  selectAllTournees,
  (tournees) => tournees.filter((t) => t.statut === StatutTournee.EN_COURS)
);

export const selectTourneesTerminees = createSelector(
  selectAllTournees,
  (tournees) => tournees.filter((t) => t.statut === StatutTournee.TERMINEE)
);

export const selectTourneesAujourdhui = createSelector(
  selectAllTournees,
  (tournees) => {
    const today = new Date().toISOString().split('T')[0];
    return tournees.filter((t) => t.dateDeb.startsWith(today));
  }
);

export const selectTourneesByEmployeId = (employeId: string) =>
  createSelector(selectAllTournees, (tournees) =>
    tournees.filter((t) => t.employe.id === employeId)
  );

export const selectTourneesLoading = createSelector(
  selectTourneeState,
  (state) => state.loading
);

export const selectTourneeById = (id: string) =>
  createSelector(selectAllTournees, (tournees) =>
    tournees.find((t) => t.id === id)
  );
