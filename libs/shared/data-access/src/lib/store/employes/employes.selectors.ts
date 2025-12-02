/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeState } from './employes.reducer';
import { Disponibilite, Role } from '../../enums';

export const selectEmployeState =
  createFeatureSelector<EmployeState>('employes');

export const selectAllEmployes = createSelector(
  selectEmployeState,
  (state) => state.employes
);

export const selectEmployesOnly = createSelector(
  selectAllEmployes,
  (employes) => employes.filter((e) => e.role === Role.EMPLOYE)
);

export const selectAdminsOnly = createSelector(selectAllEmployes, (employes) =>
  employes.filter((e) => e.role === Role.ADMIN)
);

export const selectEmployesByDisponibilite = (disponibilite: Disponibilite) =>
  createSelector(selectEmployesOnly, (employes) =>
    employes.filter(
      (e) => 'disponibilite' in e && e.disponibilite === disponibilite
    )
  );

export const selectEmployesDisponibles = createSelector(
  selectEmployesOnly,
  (employes) =>
    employes.filter(
      (e) =>
        'disponibilite' in e && e.disponibilite === Disponibilite.DISPONIBLE
    )
);

export const selectEmployesEnMission = createSelector(
  selectEmployesOnly,
  (employes) =>
    employes.filter(
      (e) =>
        'disponibilite' in e && e.disponibilite === Disponibilite.EN_MISSION
    )
);

export const selectEmployesInactifs = createSelector(
  selectEmployesOnly,
  (employes) => employes.filter((e) => 'actif' in e && e.actif === false)
);

export const selectEmployesLoading = createSelector(
  selectEmployeState,
  (state) => state.loading
);

export const selectEmployeById = (id: string) =>
  createSelector(selectAllEmployes, (employes) =>
    employes.find((e) => e.id === id)
  );
