/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AUTH_STORAGE_KEYS } from '../../auth-constants/auth.constants';

/**
 * État de l'authentification
 */
export interface AuthState {
  /** Utilisateur actuellement connecté */
  roles: string[];
  sub: string;
  /** Token JWT */
  token: string | null;
  /** Indique si une opération est en cours */
  loading: boolean;
  /** Message d'erreur */
  error: string | null;
  /** Indique si l'utilisateur est authentifié */
  isAuthenticated: boolean;
}

/**
 * État initial de l'authentification
 */
export const initialAuthState: AuthState = {
  roles: [],
  sub: '',
  token: localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN),
};

/**
 * Reducer pour l'authentification
 */
export const authReducer = createReducer(
  initialAuthState,
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { jwt, roles, sub }) => ({
    ...state,
    token: jwt,
    roles,
    sub,
    loading: false,
    isAuthenticated: true,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),
  // Logout
  on(AuthActions.logout, () => initialAuthState),
  // Change Password
  on(AuthActions.changePassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.changePasswordSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(AuthActions.changePasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
