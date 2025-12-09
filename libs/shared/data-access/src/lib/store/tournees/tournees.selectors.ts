/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TourneeState } from './tournees.reducer';
import { StatutTournee } from '../../enums';

/**
 * Sélectionne l'état global des tournées dans le store
 */
export const selectTourneeState =
  createFeatureSelector<TourneeState>('tournees');

/**
 * Selectionne le statut de chargement des tournées
 */
export const selectTourneesLoading = createSelector(
  selectTourneeState,
  (state) => state.loading
);

/**
 * Selectionne toutes les tournées
 */
export const selectAllTournees = createSelector(
  selectTourneeState,
  (state) => state.tournees
);

/**
 * Selectionne une tournée par son ID
 * @param id id de la tournée
 * @returns tournée correspondante
 */
export const selectTourneeById = (id: string) =>
  createSelector(selectAllTournees, (tournees) =>
    tournees.find((t) => t.id === id)
  );

/**
 * Filtre les tournées pour ne garder que celles d'aujourd'hui
 * @param tournees liste des tournées
 * @returns liste des tournées d'aujourd'hui
 */
const filterByToday = (tournees: any[]) => {
  if (!tournees) return [];
  const today = new Date().toISOString().split('T')[0];
  return tournees.filter((t) => t.dateDeb.startsWith(today));
};

/**
 * Selectionne les tournées par statut
 * @param statut statut de la tournée
 * @returns liste des tournées avec ce statut
 */
export const selectTourneesByStatut = (statut: StatutTournee) =>
  createSelector(selectAllTournees, (tournees) =>
    tournees.filter((t) => t.statut === statut)
  );

/**
 * Selectionne les tournées d'aujourd'hui
 */
export const selectTourneesAujourdhui = createSelector(
  selectAllTournees,
  (tournees) => filterByToday(tournees)
);

/**
 * Selectionne les tournées d'aujourd'hui
 */
export const selectTourneesAujourdhuiByStatut = (statut: StatutTournee) =>
  createSelector(selectTourneesAujourdhui, (tournees) =>
    tournees.filter((t) => t.statut === statut)
  );

/**
 * Selectionne les tournées pour un employé donné
 * @param employeId id de l'employé
 * @returns liste des tournées pour cet employé
 */
export const selectTourneesByEmployeId = (employeId: string) =>
  createSelector(selectAllTournees, (tournees) =>
    tournees.filter((t) => t.employe.id === employeId)
  );

/**
 * Selectionne les tournées d'aujourd'hui pour un employé donné
 * @param employeId id de l'employé
 * @returns liste des tournées d'aujourd'hui pour cet employé
 */
export const selectTourneesAujourdhuiByEmployeId = (employeId: string) =>
  createSelector(selectTourneesAujourdhui, (tournees) =>
    tournees.filter((t) => t.employe.id === employeId)
  );

/**
 * Selectionne les tournées d'aujourd'hui pour un employé donné et un statut donné
 * @param employeId id de l'employé
 * @param statut statut de la tournée
 * @returns liste des tournées d'aujourd'hui pour cet employé et ce statut
 */
export const selectTourneesAujourdhuiByEmployeIdAndStatut = (
  employeId: string,
  statut: StatutTournee
) =>
  createSelector(selectTourneesAujourdhuiByEmployeId(employeId), (tournees) =>
    tournees.filter((t) => t.statut === statut)
  );

// /**
//  * Selectionne les tournées non commencées
//  */
// export const selectTourneesNonCommencees = createSelector(
//   selectAllTournees,
//   (tournees) => tournees.filter((t) => t.statut === StatutTournee.NON_COMMENCEE)
// );

// /**
//  * Selectionne les tournées en cours
//  */
// export const selectTourneesEnCours = createSelector(
//   selectAllTournees,
//   (tournees) => tournees.filter((t) => t.statut === StatutTournee.EN_COURS)
// );

// /**
//  * Selectionne les tournées terminées
//  */
// export const selectTourneesTerminees = createSelector(
//   selectAllTournees,
//   (tournees) => tournees.filter((t) => t.statut === StatutTournee.TERMINEE)
// );

// /**
//  * Selectionne les tournées terminées d'aujourd'hui
//  */
// export const selectTourneesTermineesAujourdhui = createSelector(
//   selectAllTournees,
//   (tournees) => {
//     const todayTournees = filterByToday(tournees);
//     return todayTournees.filter((t) => t.statut === StatutTournee.TERMINEE);
//   }
// );

// /**
//  * Selectionne les tournées non commencées d'aujourd'hui
//  */
// export const selectTourneesNonCommenceesAujourdhui = createSelector(
//   selectAllTournees,
//   (tournees) => {
//     const todayTournees = filterByToday(tournees);
//     return todayTournees.filter(
//       (t) => t.statut === StatutTournee.NON_COMMENCEE
//     );
//   }
// );

// /**
//  * Selectionne les tournées terminées aujourd'hui pour un employé donné
//  * @param employeId id de l'employé
//  * @returns liste des tournées terminées aujourd'hui pour cet employé
//  */
// export const selectTourneesTermineesAujourdhuiByEmployeId = (
//   employeId: string
// ) =>
//   createSelector(selectAllTournees, (tournees) =>
//     filterByToday(tournees).filter((t) => t.employe.id === employeId)
//   );
