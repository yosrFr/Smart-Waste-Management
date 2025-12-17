/* eslint-disable @nx/enforce-module-boundaries */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, switchMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  AuthService,
} from '@smart-waste-management/shared/data-access';

/**
 * Guard pour protéger les routes nécessitant une authentification
 * Fonctionne de la manière suivante :
 * 1. Vérifie dans le store si l'utilisateur est déjà authentifié
 * 2. Si oui, renvoie true pour autoriser l'accès
 * 3. Sinon, vérifie si un token existe dans le localStorage
 *    - Si aucun token, redirige immédiatement vers /auth/login
 *    - Si un token existe, tente de recharger l'utilisateur courant
 * 4. Attend la fin du chargement (loading = false), puis :
 *    - Si l'utilisateur est authentifié après la recharge, renvoie true
 *    - Sinon, redirige vers /auth/login
 * @returns true si l'utilisateur est authentifié, sinon false et redirection
 */
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    switchMap((isAuthenticated) => {
      // Si l'utilisateur est déjà authentifié
      if (isAuthenticated) {
        return of(true);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        // Aucun token trouvé : redirection immédiate vers la page de login
        router.navigate(['/auth/login'], { replaceUrl: true });
        return of(false);
      }

      // Attendre la fin du chargement, puis autoriser ou refuser l'accès
      return store.select(selectAuthLoading).pipe(
        filter((loading) => !loading),
        take(1),
        switchMap(() =>
          store.select(selectIsAuthenticated).pipe(
            take(1),
            map((isAuth) => {
              if (!isAuth) {
                // Après tentative de rechargement, l'utilisateur n'est pas authentifié
                router.navigate(['/auth/login'], { replaceUrl: true });
                return false;
              }
              return true; // Authentification réussie
            })
          )
        )
      );
    })
  );
};
