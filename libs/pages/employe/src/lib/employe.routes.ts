/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { MainLayoutComponent } from '@smart-waste-management/shared/ui';
import { authGuard, employeeGuard } from '@smart-waste-management/pages/auth';
import { EmployeeDashboardComponent } from './dashboard/dashboard.component';
import { MesTourneesComponent } from './mes-tournees/mes-tournees.component';
import { SignalerComponent } from './signaler/signaler.component';

/**
 * Routes employee
 */
export const employeeRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard, employeeGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: EmployeeDashboardComponent,
      },
      {
        path: 'mes-tournees',
        component: MesTourneesComponent,
      },
      {
        path: 'signaler',
        component: SignalerComponent,
      },
    ],
  },
];
