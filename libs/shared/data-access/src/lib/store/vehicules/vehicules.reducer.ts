/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { Vehicule } from '../../models';
import * as VehiculesActions from './vehicules.actions';

/**
 * État des véhicules
 */
export interface VehiculeState {
  vehicules: Vehicule[];
  loading: boolean;
  error: string | null;
}

export const initialVehiculeState: VehiculeState = {
  vehicules: [],
  loading: false,
  error: null,
};

export const vehiculeReducer = createReducer(
  initialVehiculeState,
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
  on(VehiculesActions.createVehiculeSuccess, (state, { vehicule }) => ({
    ...state,
    vehicules: [...state.vehicules, vehicule],
  })),
  on(VehiculesActions.updateVehiculeSuccess, (state, { vehicule }) => ({
    ...state,
    vehicules: state.vehicules.map((v) =>
      v.id === vehicule.id ? vehicule : v
    ),
  })),
  on(VehiculesActions.deleteVehiculeSuccess, (state, { id }) => ({
    ...state,
    vehicules: state.vehicules.filter((v) => v.id !== id),
  })),
  on(VehiculesActions.updateVehiculeStatut, (state, { id, statut }) => ({
    ...state,
    vehicules: state.vehicules.map((v) => (v.id === id ? { ...v, statut } : v)),
  }))
);
