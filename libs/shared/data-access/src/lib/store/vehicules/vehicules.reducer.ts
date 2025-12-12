/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { Vehicule } from '../../models';
import * as VehiculesActions from './vehicules.actions';
import { StatutVehicule } from '../../enums';

/**
 * État des véhicules
 */
export interface VehiculeState {
  vehicules: Vehicule[];
  loading: boolean;
  error: string | null;
}

/**
 * État initial des véhicules
 */
export const initialVehiculeState: VehiculeState = {
  vehicules: [],
  loading: false,
  error: null,
};

/**
 * Reducer pour les véhicules
 */
export const vehiculeReducer = createReducer(
  initialVehiculeState,
  // Loading des véhicules
  on(VehiculesActions.loadVehicules, (state) => ({
    ...state,
    loading: true,
  })),
  on(VehiculesActions.loadVehiculesSuccess, (state, { vehicules }) => ({
    ...state,
    vehicules,
    loading: false,
  })),
  on(VehiculesActions.loadVehiculesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Création d'un véhicule
  on(VehiculesActions.createVehiculeSuccess, (state, { vehicule }) => ({
    ...state,
    vehicules: [...state.vehicules, vehicule],
  })),
  on(VehiculesActions.createVehiculeFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Mise à jour d'un véhicule
  on(VehiculesActions.updateVehiculeSuccess, (state, { vehicule }) => ({
    ...state,
    vehicules: state.vehicules.map((v) =>
      v.id === vehicule.id ? vehicule : v
    ),
  })),
  on(VehiculesActions.UpdateVehiculeFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Suppression d'un véhicule
  on(VehiculesActions.deleteVehiculeSuccess, (state, { id }) => ({
    ...state,
    vehicules: state.vehicules.map((v) =>
      v.id === id ? { ...v, statutVehicule: StatutVehicule.INACTIF } : v
    ),
  })),
  on(VehiculesActions.deleteVehiculeFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
