/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import { Tournee } from '../../models';

export const loadTournees = createAction('[Tournees] Load');

export const loadTourneesSuccess = createAction(
  '[Tournees] Load Success',
  props<{ tournees: Tournee[] }>()
);

export const loadTourneesFailure = createAction(
  '[Tournees] Load Failure',
  props<{ error: string }>()
);
