/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

/**
 * Effects pour l'authentification
 * Gère les side effects liés aux actions auth
 */
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Effect pour le login
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((res) => {
            const decodedToken = jwtDecode<any>(res.token); // Decode the token
            return AuthActions.loginSuccess({
              jwt: res.token,
              roles: decodedToken.roles, // Extract roles from decoded token
              sub: decodedToken.sub, // Extract sub (user identifier) from decoded token
            });
          }),

          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Redirige vers le dashboard après un login réussi
   */
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ roles }) => {
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/employee/dashboard']);
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Effect pour le logout
   */
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          // Supprime le token et l'utilisateur
          localStorage.removeItem('token');
          // Redirige vers login
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Effect pour changer le mot de passe
   */
  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePassword),
      switchMap(({ dto }) =>
        this.authService.changePassword(dto).pipe(
          map(() => AuthActions.changePasswordSuccess()),
          catchError((error) =>
            of(AuthActions.changePasswordFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
