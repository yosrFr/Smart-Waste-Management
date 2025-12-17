/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

/**
 * Sélecteur pour le feature state auth
 */
export const selectAuthState = createFeatureSelector<AuthState>('auth');

/**
 * Sélectionne si l'utilisateur est authentifié
 */
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectSub = createSelector(selectAuthState, (state) => state.sub);

export const selectRoles = createSelector(
  selectAuthState,
  (state) => state.roles
);

export const selectIsAdmin = createSelector(selectRoles, (roles) =>
  roles.includes('ROLE_ADMIN')
);

export const selectIsEmployee = createSelector(selectRoles, (roles) =>
  roles.includes('ROLE_EMPLOYE')
);

/**
 * Sélectionne l'état de chargement
 */
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

/**
 * Sélectionne l'erreur d'authentification
 */
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
