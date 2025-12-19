/* eslint-disable @nx/enforce-module-boundaries */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@smart-waste-management/shared/data-access';

/**
 *
 * Guard pour protéger les routes réservées aux amdins
 * Vérifie le rôle de l'utilisateur dans le store.
 * - Si le rôle est 'ADMIN', l'accès est autorisé.
 * - Sinon, redirige vers '/employee/dashboard'
 * @returns true si l'utilisateur est admin, ou une UrlTree pour rediriger
 */
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const role = authService.getRolesFromToken()[0];

  if (role === 'ROLE_ADMIN') {
    return true;
  }
  return router.createUrlTree(['/employee/dashboard']);
};
