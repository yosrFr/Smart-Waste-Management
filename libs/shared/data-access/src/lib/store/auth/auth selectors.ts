/* eslint-disable @nx/enforce-module-boundaries */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

/**
 * Sélecteur pour le feature state auth
 */
export const selectAuthState = createFeatureSelector<AuthState>('auth');

/**
 * Sélectionne l'utilisateur actuel
 */
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.user
);

/**
 * Sélectionne le token
 */
export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

/**
 * Sélectionne si l'utilisateur est authentifié
 */
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

/**
 * Sélectionne le rôle de l'utilisateur
 */
export const selectUserRole = createSelector(
  selectCurrentUser,
  (user) => user?.role
);

/**
 * Vérifie si l'utilisateur est admin
 */
export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === 'ADMIN'
);

/**
 * Sélectionne l'état de chargement
 */
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

/**
 * Sélectionne l'erreur
 */
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
