/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { MainLayoutComponent } from '@smart-waste-management/shared/ui';
import { ProfilComponent } from './profil/profil.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { authGuard } from '@smart-waste-management/pages/auth';

/**
 * Routes partagées entre Admin et Employé
 */
export const sharedRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'profil',
        component: ProfilComponent,
        data: { title: 'Profil' },
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: { title: 'Notifications' },
      },
    ],
  },
];
