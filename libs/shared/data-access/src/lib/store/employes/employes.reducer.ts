/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { Employe, Utilisateur } from '../../models';
import * as EmployesActions from './employes.actions';

/**
 * État des employés
 */
export interface EmployeState {
  employes: (Employe | Utilisateur)[];
  loading: boolean;
  error: string | null;
}

export const initialState: EmployeState = {
  employes: [],
  loading: false,
  error: null,
};

export const employeReducer = createReducer(
  initialState,
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
  on(EmployesActions.createEmployeSuccess, (state, { employe }) => ({
    ...state,
    employes: [...state.employes, employe],
  })),
  on(EmployesActions.updateEmployeSuccess, (state, { employe }) => ({
    ...state,
    employes: state.employes.map((e) => (e.id === employe.id ? employe : e)),
  })),
  on(EmployesActions.deleteEmployeSuccess, (state, { id }) => ({
    ...state,
    employes: state.employes.filter((e) => e.id !== id),
  })),
  on(
    EmployesActions.updateEmployeDisponibilite,
    (state, { id, disponibilite }) => ({
      ...state,
      employes: state.employes.map((e) =>
        e.id === id && 'disponibilite' in e ? { ...e, disponibilite } : e
      ),
    })
  )
);
