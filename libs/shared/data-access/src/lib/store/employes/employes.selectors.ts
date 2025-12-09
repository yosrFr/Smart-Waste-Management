/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeState } from './employes.reducer';
import { Disponibilite, Role } from '../../enums';

/**
 * Sélecteur pour le feature state employes
 */
export const selectEmployeState =
  createFeatureSelector<EmployeState>('employes');

/**
 * Sélectionne l'état de chargement des employés
 * @returns 'true' si le chargement est en cours, sinon 'false'
 */
export const selectEmployesLoading = createSelector(
  selectEmployeState,
  (state) => state.loading
);

/**
 * Sélectionne tous les utilisateurs (employés + administrateurs)
 */
export const selectAllEmployes = createSelector(
  selectEmployeState,
  (state) => state.employes
);

/**
 * Sélectionne un employé par son ID
 * @param id id de l'employé
 * @returns employé correspondant à l'ID spécifié
 */
export const selectEmployeById = (id: string) =>
  createSelector(selectAllEmployes, (employes) =>
    employes.find((e) => e.id === id)
  );

/**
 * Sélectionne uniquement les employés
 */
export const selectEmployesOnly = createSelector(
  selectAllEmployes,
  (employes) => employes.filter((e) => e.role === Role.EMPLOYE)
);

/**
 * Sélectionne uniquement les administrateurs
 */
export const selectAdminsOnly = createSelector(selectAllEmployes, (employes) =>
  employes.filter((e) => e.role === Role.ADMIN)
);

/**
 * Sélectionne les employés par disponibilité
 * @param disponibilite disponibilité de l'employé
 * @returns liste des employés avec la disponibilité spécifiée
 */
export const selectEmployesByDisponibilite = (disponibilite: Disponibilite) =>
  createSelector(selectEmployesOnly, (employes) =>
    employes.filter(
      (e) => 'disponibilite' in e && e.disponibilite === disponibilite
    )
  );

/**
 * Sélectionne les employés inactifs
 */
export const selectEmployesInactifs = createSelector(
  selectAllEmployes,
  (employes) => employes.filter((e) => 'actif' in e && e.actif === false)
);

// /**
//  * Sélectionne les utilisateurs par role (employé ou admin)
//  * @param role role de l'utilisateur
//  * @returns liste des utilisateurs avec le role spécifié
//  */
// export const selectEmployesByRole = (role: Role) =>
//   createSelector(selectAllEmployes, (employes) =>
//     employes.filter((e) => e.role === role)
//   );

// /**
//  * Sélectionne les employés disponibles
//  */
// export const selectEmployesDisponibles = createSelector(
//   selectEmployesOnly,
//   (employes) =>
//     employes.filter(
//       (e) =>
//         'disponibilite' in e && e.disponibilite === Disponibilite.DISPONIBLE
//     )
// );

// /**
//  * Sélectionne les employés en mission
//  */
// export const selectEmployesEnMission = createSelector(
//   selectEmployesOnly,
//   (employes) =>
//     employes.filter(
//       (e) =>
//         'disponibilite' in e && e.disponibilite === Disponibilite.EN_MISSION
//     )
// );
