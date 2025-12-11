/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import {
  PointDeCollecte,
  CreatePointCollecteDto,
  UpdatePointCollecteDto,
} from '../../models';

/**
 * Actions pour la gestion des points de collecte
 */

/**
 * Charger les points de collecte
 */
export const loadPointsCollecte = createAction('[Points Collecte] Load');

/**
 * Points de collecte chargés avec succès
 */
export const loadPointsCollecteSuccess = createAction(
  '[Points Collecte] Load Success',
  props<{ points: PointDeCollecte[] }>()
);

/**
 * Échec du chargement des points de collecte
 */
export const loadPointsCollecteFailure = createAction(
  '[Points Collecte] Load Failure',
  props<{ error: string }>()
);

/**
 * Créer un point de collecte
 */
export const createPointCollecte = createAction(
  '[Points Collecte] Create',
  props<{ dto: CreatePointCollecteDto }>()
);

/**
 * Point de collecte créé avec succès
 */
export const createPointCollecteSuccess = createAction(
  '[Points Collecte] Create Success',
  props<{ point: PointDeCollecte }>()
);

/**
 * Echec de création du point de collecte
 */
export const createPointCollecteFailure = createAction(
  '[Points Collecte] Create Failure',
  props<{ error: string }>()
);

/**
 * Mettre à jour un point de collecte
 */
export const updatePointCollecte = createAction(
  '[Points Collecte] Update',
  props<{ id: string; dto: UpdatePointCollecteDto }>()
);

/**
 * Point de collecte mis à jour avec succès
 */
export const updatePointCollecteSuccess = createAction(
  '[Points Collecte] Update Success',
  props<{ point: PointDeCollecte }>()
);

/**
 * Echec de mise à jour du point de collecte
 */
export const updatePointCollecteFailure = createAction(
  '[Points Collecte] Update Failure',
  props<{ error: string }>()
);

/**
 * Supprimer un point de collecte
 */
export const deletePointCollecte = createAction(
  '[Points Collecte] Delete',
  props<{ id: string }>()
);

/**
 * Point de collecte supprimé avec succès
 */
export const deletePointCollecteSuccess = createAction(
  '[Points Collecte] Delete Success',
  props<{ id: string }>()
);

/**
 * Echec de suppression du point de collecte
 */
export const deletePointCollecteFailure = createAction(
  '[Points Collecte] Delete Failure',
  props<{ error: string }>()
);
