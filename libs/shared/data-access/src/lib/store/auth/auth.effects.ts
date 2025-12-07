/* eslint-disable @nx/enforce-module-boundaries */
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';

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
          map((response) => AuthActions.loginSuccess({ response })),
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
        tap(({ response }) => {
          // Sauvegarde le token
          localStorage.setItem('token', response.token);
          // Sauvegarde l'utilisateur
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          // Redirige selon le rôle
          const route =
            response.user.role === 'ADMIN'
              ? '/admin/dashboard'
              : '/employee/dashboard';
          this.router.navigate([route]);
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
          localStorage.removeItem('currentUser');
          // Redirige vers login
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Effect pour charger l'utilisateur au démarrage
   */
  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      map(() => {
        const userStr = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');

        if (userStr && token) {
          try {
            const user = JSON.parse(userStr);
            return AuthActions.loadCurrentUserSuccess({ user });
          } catch (e) {
            return AuthActions.loadCurrentUserFailure({
              error: 'Erreur de session',
            });
          }
        }
        return AuthActions.loadCurrentUserFailure({ error: 'Pas de session' });
      })
    )
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
