/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import {
  LoginDto,
  LoginResponse,
  ChangePasswordDto,
  Utilisateur,
} from '../../models';

/**
 * Actions pour l'authentification
 */

/**
 * Action de login
 */
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginDto }>()
);

/**
 * Action de login réussi
 */
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: LoginResponse }>()
);

/**
 * Action de login échoué
 */
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

/**
 * Action de logout
 */
export const logout = createAction('[Auth] Logout');

/**
 * Action de changement de mot de passe
 */
export const changePassword = createAction(
  '[Auth] Change Password',
  props<{ dto: ChangePasswordDto }>()
);

/**
 * Action de changement de mot de passe réussi
 */
export const changePasswordSuccess = createAction(
  '[Auth] Change Password Success'
);

/**
 * Action de changement de mot de passe échoué
 */
export const changePasswordFailure = createAction(
  '[Auth] Change Password Failure',
  props<{ error: string }>()
);

/**
 * Action de chargement de l'utilisateur courant
 */
export const loadCurrentUser = createAction('[Auth] Load Current User');

/**
 * Action de chargement de l'utilisateur courant réussi
 */
export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: Utilisateur }>()
);

/**
 * Action de chargement de l'utilisateur courant échoué
 */
export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: string }>()
);
