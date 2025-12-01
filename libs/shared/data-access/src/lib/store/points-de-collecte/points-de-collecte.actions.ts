/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import {
  PointDeCollecte,
  CreatePointCollecteDto,
  UpdatePointCollecteDto,
} from '../../models';

export const loadPointsCollecte = createAction('[Points Collecte] Load');

export const loadPointsCollecteSuccess = createAction(
  '[Points Collecte] Load Success',
  props<{ points: PointDeCollecte[] }>()
);

export const loadPointsCollecteFailure = createAction(
  '[Points Collecte] Load Failure',
  props<{ error: string }>()
);

export const createPointCollecte = createAction(
  '[Points Collecte] Create',
  props<{ dto: CreatePointCollecteDto }>()
);

export const createPointCollecteSuccess = createAction(
  '[Points Collecte] Create Success',
  props<{ point: PointDeCollecte }>()
);

export const updatePointCollecte = createAction(
  '[Points Collecte] Update',
  props<{ id: string; dto: UpdatePointCollecteDto }>()
);

export const updatePointCollecteSuccess = createAction(
  '[Points Collecte] Update Success',
  props<{ point: PointDeCollecte }>()
);

export const deletePointCollecte = createAction(
  '[Points Collecte] Delete',
  props<{ id: string }>()
);

export const deletePointCollecteSuccess = createAction(
  '[Points Collecte] Delete Success',
  props<{ id: string }>()
);

export const refreshPointsCollecte = createAction(
  '[Points Collecte] Refresh Levels'
);

export const refreshPointsCollecteSuccess = createAction(
  '[Points Collecte] Refresh Levels Success',
  props<{ points: PointDeCollecte[] }>()
);
