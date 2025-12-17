/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@smart-waste-management/shared/data-access';

/**
 * Item de menu du sidebar
 */
interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

/**
 * Composant Sidebar adaptatif selon le rôle
 */
@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);

  /** Menus pour admin */
  private adminMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    {
      label: 'Points de collecte',
      icon: 'location_on',
      route: '/admin/points-collecte',
    },
    { label: 'Véhicules', icon: 'local_shipping', route: '/admin/vehicules' },
    { label: 'Employés', icon: 'people', route: '/admin/employes' },
    { label: 'Tournées', icon: 'route', route: '/admin/tournees' },
    {
      label: 'Notifications',
      icon: 'notifications',
      route: '/shared/notifications',
    },
    { label: 'Profil', icon: 'person', route: '/shared/profil' },
  ];

  /** Menus pour employé */
  private employeeMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/employee/dashboard' },
    { label: 'Mes tournées', icon: 'route', route: '/employee/mes-tournees' },
    {
      label: 'Signaler un problème',
      icon: 'report_problem',
      route: '/employee/signaler',
    },
    {
      label: 'Notifications',
      icon: 'notifications',
      route: '/shared/notifications',
    },
    { label: 'Profil', icon: 'person', route: '/shared/profil' },
  ];

  /** Items de menu visibles selon le rôle */
  visibleMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    const role = this.authService.getRolesFromToken()[0];
    this.visibleMenuItems =
      role === 'ROLE_ADMIN' ? this.adminMenuItems : this.employeeMenuItems;
  }
}
