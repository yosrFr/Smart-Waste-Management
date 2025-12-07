/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

/**
 * Configuration des routes principales de l'application
 * Utilise le lazy loading pour charger les features à la demande
 */
export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@smart-waste-management/pages/auth').then((m) => m.authRoutes),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('@smart-waste-management/pages/admin').then((m) => m.adminRoutes),
  },
  {
    path: 'employee',
    loadChildren: () =>
      import('@smart-waste-management/pages/employe').then(
        (m) => m.employeeRoutes
      ),
  },
  {
    path: 'shared',
    loadChildren: () =>
      import('@smart-waste-management/pages/shared').then(
        (m) => m.sharedRoutes
      ),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
