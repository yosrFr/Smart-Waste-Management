/* eslint-disable @nx/enforce-module-boundaries */
import { createReducer, on } from '@ngrx/store';
import { Utilisateur } from '../../models';
import * as AuthActions from './auth.actions';

/**
 * État de l'authentification
 */
export interface AuthState {
  /** Utilisateur actuellement connecté */
  user: Utilisateur | null;
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
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
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
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    token: response.token,
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
  })),
  // Load Current User
  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => {
    const token = localStorage.getItem('token');
    return {
      ...state,
      user,
      token,
      loading: false,
      isAuthenticated: true,
      error: null,
    };
  }),
  on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  }))
);
