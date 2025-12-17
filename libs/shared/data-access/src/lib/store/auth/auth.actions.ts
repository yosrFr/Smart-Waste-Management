/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import { ChangePasswordDto, LoginDto } from '../../models';

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
  props<{ jwt: string; roles: string[]; sub: string }>()
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
