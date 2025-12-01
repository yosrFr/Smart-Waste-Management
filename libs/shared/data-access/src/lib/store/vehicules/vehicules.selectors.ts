/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VehiculeState } from './vehicules.reducer';
import { StatutVehicule, TypeDechet } from '../../enums';

export const selectVehiculeState =
  createFeatureSelector<VehiculeState>('vehicules');

export const selectAllVehicules = createSelector(
  selectVehiculeState,
  (state) => state.vehicules
);

export const selectVehiculesByStatut = (statut: StatutVehicule) =>
  createSelector(selectAllVehicules, (vehicules) =>
    vehicules.filter((v) => v.statut === statut)
  );

export const selectVehiculesActifs = createSelector(
  selectAllVehicules,
  (vehicules) => vehicules.filter((v) => v.statut === StatutVehicule.ACTIF)
);

export const selectVehiculesEnMission = createSelector(
  selectAllVehicules,
  (vehicules) => vehicules.filter((v) => v.statut === StatutVehicule.EN_MISSION)
);

export const selectVehiculesEnReparation = createSelector(
  selectAllVehicules,
  (vehicules) =>
    vehicules.filter((v) => v.statut === StatutVehicule.EN_REPARATION)
);

export const selectVehiculesByType = (typeDechet: TypeDechet) =>
  createSelector(selectAllVehicules, (vehicules) =>
    vehicules.filter((v) => v.typeDechet === typeDechet)
  );

export const selectVehiculesLoading = createSelector(
  selectVehiculeState,
  (state) => state.loading
);

export const selectVehiculeById = (id: string) =>
  createSelector(selectAllVehicules, (vehicules) =>
    vehicules.find((v) => v.id === id)
  );
