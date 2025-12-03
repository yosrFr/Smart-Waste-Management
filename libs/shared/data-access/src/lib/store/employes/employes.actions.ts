/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import {
  Employe,
  CreateUtilisateurDto,
  UpdateUtilisateurAdminDto,
  Administrateur,
  UpdateProfilEmployeDto,
} from '../../models';
import { Disponibilite } from '../../enums';

export const loadEmployes = createAction('[Employes] Load');

export const loadEmployesSuccess = createAction(
  '[Employes] Load Success',
  props<{ employes: (Employe | Administrateur)[] }>()
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
  props<{ employe: Employe | Administrateur }>()
);

export const createEmployeFailure = createAction(
  '[Employes] Create Failure',
  props<{ error: string }>()
);

export const updateEmployeByAdmin = createAction(
  '[Employes] Update By Admin',
  props<{ id: string; dto: UpdateUtilisateurAdminDto }>()
);

export const updateEmployeByAdminSuccess = createAction(
  '[Employes] Update By Admin Success',
  props<{ employe: Employe | Administrateur }>()
);

export const updateEmployeByAdminFailure = createAction(
  '[Employes] Update By Admin Failure',
  props<{ error: string }>()
);

export const updateProfilEmploye = createAction(
  '[Employes] Update Profil Employe',
  props<{ id: string; dto: UpdateProfilEmployeDto }>()
);

export const updateProfilEmployeSuccess = createAction(
  '[Employes] Update Profil Employe Success',
  props<{ employe: Employe | Administrateur }>()
);

export const updateProfilEmployeFailure = createAction(
  '[Employes] Update Profil Employe Failure',
  props<{ error: string }>()
);

export const deleteEmploye = createAction(
  '[Employes] Delete',
  props<{ id: string }>()
);

export const deleteEmployeSuccess = createAction(
  '[Employes] Delete Success',
  props<{ id: string }>()
);

export const deleteEmployeFailure = createAction(
  '[Employes] Delete Failure',
  props<{ error: string }>()
);

export const updateEmployeDisponibilite = createAction(
  '[Employes] Update Disponibilite',
  props<{ id: string; disponibilite: Disponibilite }>()
);
