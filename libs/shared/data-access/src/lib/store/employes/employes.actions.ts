/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import {
  Employe,
  CreateUtilisateurDto,
  UpdateUtilisateurDto,
  Administrateur,
  UpdateProfilEmployeDto,
} from '../../models';

/**
 * Actions pour la gestion des employés
 */

/**
 * Action de chargement des employés
 */
export const loadEmployes = createAction('[Employes] Load');

/**
 * Action de chargement des employés réussi
 */
export const loadEmployesSuccess = createAction(
  '[Employes] Load Success',
  props<{ employes: (Employe | Administrateur)[] }>()
);

/**
 * Action de chargement des employés échoué
 */
export const loadEmployesFailure = createAction(
  '[Employes] Load Failure',
  props<{ error: string }>()
);

/**
 * Action de création d'un employé
 */
export const createEmploye = createAction(
  '[Employes] Create',
  props<{ dto: CreateUtilisateurDto }>()
);

/**
 * Action de création d'un employé réussi
 */
export const createEmployeSuccess = createAction(
  '[Employes] Create Success',
  props<{ employe: Employe | Administrateur }>()
);

/**
 * Action de création d'un employé échoué
 */
export const createEmployeFailure = createAction(
  '[Employes] Create Failure',
  props<{ error: string }>()
);

/**
 * Action de mise à jour d'un employé par un admin
 */
export const updateEmployeByAdmin = createAction(
  '[Employes] Update By Admin',
  props<{ id: string; dto: UpdateUtilisateurDto }>()
);

/**
 * Action de mise à jour d'un employé par un admin réussi
 */
export const updateEmployeByAdminSuccess = createAction(
  '[Employes] Update By Admin Success',
  props<{ employe: Employe | Administrateur }>()
);

/**
 * Action de mise à jour d'un employé par un admin échoué
 */
export const updateEmployeByAdminFailure = createAction(
  '[Employes] Update By Admin Failure',
  props<{ error: string }>()
);

/**
 * Action de mise à jour du profil d'un employé
 */
export const updateProfilEmploye = createAction(
  '[Employes] Update Profil Employe',
  props<{ id: string; dto: UpdateProfilEmployeDto }>()
);

/**
 * Action de mise à jour du profil d'un employé réussi
 */
export const updateProfilEmployeSuccess = createAction(
  '[Employes] Update Profil Employe Success',
  props<{ employe: Employe | Administrateur }>()
);

/**
 * Action de mise à jour du profil d'un employé échoué
 */
export const updateProfilEmployeFailure = createAction(
  '[Employes] Update Profil Employe Failure',
  props<{ error: string }>()
);

/**
 * Action de suppression d'un employé
 */
export const deleteEmploye = createAction(
  '[Employes] Delete',
  props<{ id: string }>()
);

/**
 * Action de suppression d'un employé réussi
 */
export const deleteEmployeSuccess = createAction(
  '[Employes] Delete Success',
  props<{ id: string }>()
);

/**
 * Action de suppression d'un employé échoué
 */
export const deleteEmployeFailure = createAction(
  '[Employes] Delete Failure',
  props<{ error: string }>()
);
