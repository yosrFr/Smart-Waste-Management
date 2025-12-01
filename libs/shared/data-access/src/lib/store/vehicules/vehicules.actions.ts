/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import { Vehicule, CreateVehiculeDto } from '../../models';
import { StatutVehicule } from '../../enums';

export const loadVehicules = createAction('[Vehicules] Load');

export const loadVehiculesSuccess = createAction(
  '[Vehicules] Load Success',
  props<{ vehicules: Vehicule[] }>()
);

export const loadVehiculesFailure = createAction(
  '[Vehicules] Load Failure',
  props<{ error: string }>()
);

export const createVehicule = createAction(
  '[Vehicules] Create',
  props<{ dto: CreateVehiculeDto }>()
);

export const createVehiculeSuccess = createAction(
  '[Vehicules] Create Success',
  props<{ vehicule: Vehicule }>()
);

export const updateVehicule = createAction(
  '[Vehicules] Update',
  props<{ id: string; dto: Partial<CreateVehiculeDto> }>()
);

export const updateVehiculeSuccess = createAction(
  '[Vehicules] Update Success',
  props<{ vehicule: Vehicule }>()
);

export const deleteVehicule = createAction(
  '[Vehicules] Delete',
  props<{ id: string }>()
);

export const deleteVehiculeSuccess = createAction(
  '[Vehicules] Delete Success',
  props<{ id: string }>()
);

export const updateVehiculeStatut = createAction(
  '[Vehicules] Update Statut',
  props<{ id: string; statut: StatutVehicule }>()
);
