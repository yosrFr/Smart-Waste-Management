/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VehiculeState } from './vehicules.reducer';
import { StatutVehicule, TypeDechet } from '../../enums';

/**
 * Sélectionne l'état global des véhicules dans le store
 */
export const selectVehiculeState =
  createFeatureSelector<VehiculeState>('vehicules');

/**
 * Selectionne le statut de chargement des véhicules
 */
export const selectVehiculesLoading = createSelector(
  selectVehiculeState,
  (state) => state.loading
);

/**
 * Selectionne tous les véhicules
 */
export const selectAllVehicules = createSelector(
  selectVehiculeState,
  (state) => state.vehicules
);

/**
 * Selectionne un véhicule par son ID
 * @param id id du véhicule
 * @returns véhicule correspondant
 */
export const selectVehiculeById = (id: string) =>
  createSelector(selectAllVehicules, (vehicules) =>
    vehicules.find((v) => v.id === id)
  );

/**
 * Selectionne les véhicules par statut
 * @param statut statut du véhicule
 * @returns liste des véhicules avec ce statut
 */
export const selectVehiculesByStatut = (statut: StatutVehicule) =>
  createSelector(selectAllVehicules, (vehicules) =>
    vehicules.filter((v) => v.statutVehicule === statut)
  );

/**
 * Selectionne les véhicules par type de déchet
 * @param typeDechet type de déchet
 * @returns liste des véhicules avec ce type de déchet
 */
export const selectVehiculesByTypeDechet = (typeDechet: TypeDechet) =>
  createSelector(selectAllVehicules, (vehicules) =>
    vehicules.filter((v) => v.typeDechet === typeDechet)
  );
