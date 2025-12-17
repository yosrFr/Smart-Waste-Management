/* eslint-disable @nx/enforce-module-boundaries */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '@smart-waste-management/shared/data-access';
import { map, take } from 'rxjs/operators';

/**
 *
 * Guard pour protéger les routes réservées aux employés
 * Vérifie le rôle de l'utilisateur dans le store.
 * - Si le rôle est 'EMPLOYE', l'accès est autorisé.
 * - Sinon, redirige vers '/admin/dashboard'
 * @returns true si l'utilisateur est employé, ou une UrlTree pour rediriger
 */
export const employeeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const role = authService.getRolesFromToken()[0];

  if (role === 'ROLE_EMPLOYE') {
    return true;
  }
  return router.createUrlTree(['/admin/dashboard']);
};
