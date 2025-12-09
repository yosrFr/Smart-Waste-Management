/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import { Tournee } from '../../models';
import { GeoPoint } from '../../interfaces';

/**
 * Actions pour la gestion des tournées
 */

/**
 * Charger les tournées
 */
export const loadTournees = createAction('[Tournees] Load');

/**
 * Tournées chargées avec succès
 */
export const loadTourneesSuccess = createAction(
  '[Tournees] Load Success',
  props<{ tournees: Tournee[] }>()
);

/**
 * Echec du chargement des tournées
 */
export const loadTourneesFailure = createAction(
  '[Tournees] Load Failure',
  props<{ error: string }>()
);

/**
 * Mettre à jour la position du véhicule dans une tournée
 */
export const updateTourneePosition = createAction(
  '[Tournees] Update Position',
  props<{ id: string; position: GeoPoint }>()
);
