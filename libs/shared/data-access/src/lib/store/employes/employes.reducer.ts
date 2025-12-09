/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { Administrateur, Employe } from '../../models';
import * as EmployesActions from './employes.actions';

/**
 * État des employés
 */
export interface EmployeState {
  employes: (Employe | Administrateur)[];
  loading: boolean;
  error: string | null;
}

/**
 * État initial des employés
 */
export const initialEmployeState: EmployeState = {
  employes: [],
  loading: false,
  error: null,
};

/**
 * Reducer pour la gestion des employés
 */
export const employeReducer = createReducer(
  initialEmployeState,
  // Loading des utilisateurs
  on(EmployesActions.loadEmployes, (state) => ({
    ...state,
    loading: true,
  })),
  on(EmployesActions.loadEmployesSuccess, (state, { employes }) => ({
    ...state,
    employes,
    loading: false,
  })),
  on(EmployesActions.loadEmployesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Création d'un utilisateur
  on(EmployesActions.createEmployeSuccess, (state, { employe }) => ({
    ...state,
    employes: [...state.employes, employe],
  })),
  on(EmployesActions.createEmployeFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Update d'un utilisateur par un admin
  on(EmployesActions.updateEmployeByAdminSuccess, (state, { employe }) => ({
    ...state,
    employes: state.employes.map((e) => (e.id === employe.id ? employe : e)),
  })),
  on(EmployesActions.updateEmployeByAdminFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Update du profil d'un utilisateur
  on(EmployesActions.updateProfilEmployeSuccess, (state, { employe }) => ({
    ...state,
    employes: state.employes.map((e) => (e.id === employe.id ? employe : e)),
  })),
  on(EmployesActions.updateProfilEmployeFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Suppression d'un utilisateur
  on(EmployesActions.deleteEmployeSuccess, (state, { id }) => ({
    ...state,
    employes: state.employes.filter((e) => e.id !== id),
  })),
  on(EmployesActions.deleteEmployeFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
