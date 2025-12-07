/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { MainLayoutComponent } from '@smart-waste-management/shared/ui';
import { authGuard, adminGuard } from '@smart-waste-management/pages/auth';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PointsCollecteComponent } from './points-de-collecte/points-de-collecte.component';
import { VehiculesComponent } from './vehicules/vehicules.component';
import { EmployesComponent } from './employes/employes.component';
import { TourneesComponent } from './tournees/tournees.component';

export const adminRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
      },
      {
        path: 'points-collecte',
        component: PointsCollecteComponent,
        data: { title: 'Points de collecte' },
      },
      {
        path: 'vehicules',
        component: VehiculesComponent,
        data: { title: 'Véhicules' },
      },
      {
        path: 'employes',
        component: EmployesComponent,
        data: { title: 'Employés' },
      },
      {
        path: 'tournees',
        component: TourneesComponent,
        data: { title: 'Tournées' },
      },
    ],
  },
];
