/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import {
  Employe,
  Utilisateur,
  CreateUtilisateurDto,
  UpdateUtilisateurAdminDto,
} from '../../models';
import { Disponibilite } from '../../enums';

export const loadEmployes = createAction('[Employes] Load');

export const loadEmployesSuccess = createAction(
  '[Employes] Load Success',
  props<{ employes: (Employe | Utilisateur)[] }>()
);

export const loadEmployesFailure = createAction(
  '[Employes] Load Failure',
  props<{ error: string }>()
);

export const createEmploye = createAction(
  '[Employes] Create',
  props<{ dto: CreateUtilisateurDto }>()
);

export const createEmployeSuccess = createAction(
  '[Employes] Create Success',
  props<{ employe: Employe | Utilisateur }>()
);

export const updateEmploye = createAction(
  '[Employes] Update',
  props<{ id: string; dto: UpdateUtilisateurAdminDto }>()
);

export const updateEmployeSuccess = createAction(
  '[Employes] Update Success',
  props<{ employe: Employe | Utilisateur }>()
);

export const deleteEmploye = createAction(
  '[Employes] Delete',
  props<{ id: string }>()
);

export const deleteEmployeSuccess = createAction(
  '[Employes] Delete Success',
  props<{ id: string }>()
);

export const updateEmployeDisponibilite = createAction(
  '[Employes] Update Disponibilite',
  props<{ id: string; disponibilite: Disponibilite }>()
);
