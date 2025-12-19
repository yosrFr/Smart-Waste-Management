/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TourneeState } from './tournees.reducer';
import { Role, StatutTournee } from '../../enums';
import { PointDeCollecte, Tournee } from '../../models';
import { selectAllPointsCollecte } from '../points-de-collecte';
import { selectAllVehicules } from '../vehicules';
import { selectAllEmployes } from '../employes';

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
 * Filtre les tournées pour ne garder que celles d'aujourd'hui
 * @param tournees liste des tournées
 * @returns liste des tournées d'aujourd'hui
 */
const filterByToday = (tournees: Tournee[]) => {
  if (!tournees) return [];
  const today = new Date().toISOString().split('T')[0];
  return tournees.filter((t) => t.dateDebut.toISOString().startsWith(today));
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
    tournees.filter((t) => t.employeId === employeId)
  );

export const selectTourneesByEmployeIdAndStatut = (
  emplyeId: string,
  statut: StatutTournee
) =>
  createSelector(selectTourneesByEmployeId(emplyeId), (tournee) =>
    tournee.filter((t) => t.statut === statut)
  );

/**
 * Selectionne les tournées d'aujourd'hui pour un employé donné
 * @param employeId id de l'employé
 * @returns liste des tournées d'aujourd'hui pour cet employé
 */
export const selectTourneesAujourdhuiByEmployeId = (employeId: string) =>
  createSelector(selectTourneesAujourdhui, (tournees) =>
    tournees.filter((t) => t.employeId === employeId)
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

export const selectTourneesEnrichies = createSelector(
  selectAllTournees,
  selectAllPointsCollecte,
  selectAllVehicules,
  selectAllEmployes,
  (tournees, points, vehicules, employes): Tournee[] => {
    const employesOnly = employes.filter((e) => e.role === Role.EMPLOYE);

    return tournees.map((t) => ({
      ...t,
      pointsDeCollecte: t.pointsDeCollecteIds
        .map((id) => points.find((p) => p.id === id))
        .filter((p): p is PointDeCollecte => !!p),

      vehicule: vehicules.find((v) => v.matricule === t.vehiculeId),

      employe: employesOnly.find((e) => e.id === t.employeId),
    }));
  }
);

export const selectTourneesEnrichiesByEmployeId = (employeId: string) =>
  createSelector(selectTourneesEnrichies, (tournees) =>
    tournees.filter((t) => t.employeId === employeId)
  );

export const selectTourneesEnrichiesByEmployeIdAndStatut = (
  employeId: string,
  statut: StatutTournee
) =>
  createSelector(selectTourneesEnrichiesByEmployeId(employeId), (tournees) =>
    tournees.filter((t) => t.statut === statut)
  );

export const selectTourneeById = (id: string) =>
  createSelector(
    selectTourneesEnrichies,
    (tournees) => tournees.find((t) => t.id === id) ?? null
  );
