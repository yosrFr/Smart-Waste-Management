/* eslint-disable @nx/enforce-module-boundaries */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  map,
  take,
  switchMap,
  filter,
  distinctUntilChanged,
} from 'rxjs/operators';
import { of } from 'rxjs';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  loadCurrentUser,
} from '@smart-waste-management/shared/data-access';

/**
 * Guard pour protéger les routes nécessitant une authentification
 */
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (isAuthenticated) {
        return of(true);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        // Redirige immédiatement sans créer d'historique
        router.navigate(['/auth/login'], { replaceUrl: true });
        return of(false);
      }

      // We have a token but the store is not yet authenticated - try to rehydrate
      store.dispatch(loadCurrentUser());

      // Wait for loading to finish, then allow or deny based on final auth state
      return store.select(selectAuthLoading).pipe(
        filter((loading) => !loading),
        take(1),
        switchMap(() =>
          store.select(selectIsAuthenticated).pipe(
            take(1),
            map((isAuth) => {
              if (!isAuth) {
                // Redirige immédiatement sans créer d'historique
                router.navigate(['/auth/login'], { replaceUrl: true });
                return false;
              }
              return true;
            })
          )
        )
      );
    })
  );
};
