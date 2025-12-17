/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import { Vehicule, CreateVehiculeDto, UpdateVehiculeDto } from '../../models';

/**
 * Actions pour la gestion des véhicules
 */

/**
 * Charger les véhicules
 */
export const loadVehicules = createAction('[Vehicules] Load');

/**
 * Véhicules chargés avec succès
 */
export const loadVehiculesSuccess = createAction(
  '[Vehicules] Load Success',
  props<{ vehicules: Vehicule[] }>()
);

/**
 * Échec du chargement des véhicules
 */
export const loadVehiculesFailure = createAction(
  '[Vehicules] Load Failure',
  props<{ error: string }>()
);

/**
 * Création d'un véhicule
 */
export const createVehicule = createAction(
  '[Vehicules] Create',
  props<{ dto: CreateVehiculeDto }>()
);

/**
 * Création d'un véhicule avec succès
 */
export const createVehiculeSuccess = createAction(
  '[Vehicules] Create Success',
  props<{ vehicule: Vehicule }>()
);

/**
 * Echec de création d'un véhicule
 */
export const createVehiculeFailure = createAction(
  '[Vehicules] Create Failure',
  props<{ error: string }>()
);

/**
 * Mise à jour d'un véhicule
 */
export const updateVehicule = createAction(
  '[Vehicules] Update',
  props<{ id: string; dto: UpdateVehiculeDto }>()
);

/**
 * Mise à jour d'un véhicule avec succès
 */
export const updateVehiculeSuccess = createAction(
  '[Vehicules] Update Success',
  props<{ vehicule: Vehicule }>()
);

/**
 * Echec de mise à jour d'un véhicule
 */
export const UpdateVehiculeFailure = createAction(
  '[Vehicules] Update Failure',
  props<{ error: string }>()
);

/**
 * Supprimer un véhicule
 */
export const deleteVehicule = createAction(
  '[Vehicules] Delete',
  props<{ id: string }>()
);

/**
 * Supprimer un véhicule avec succès
 */
export const deleteVehiculeSuccess = createAction(
  '[Vehicules] Delete Success',
  props<{ id: string }>()
);

/**
 * Echec de suppression d'un véhicule
 */
export const deleteVehiculeFailure = createAction(
  '[Vehicules] Delete Failure',
  props<{ error: string }>()
);
