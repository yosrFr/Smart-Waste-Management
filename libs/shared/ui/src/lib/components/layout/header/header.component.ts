/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectCurrentUser,
  selectRecentNotifications,
  logout,
  AppNotification,
  Utilisateur,
} from '@smart-waste-management/shared/data-access';
import { ThemeService, ThemeMode } from '../../../services/theme.service';
import { DateRelativePipe, EnumLabelPipe } from '../../../pipes';

/**
 * Composant Header de l'application
 * Contient: toggle sidebar, titre page, notifications, menu utilisateur, thème
 */
@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatListModule,
    MatDividerModule,
    DateRelativePipe,
    EnumLabelPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  /** Titre de la page actuelle */
  pageTitle = 'Dashboard';

  /** Événement pour toggle le sidebar */
  @Output() toggleSidebar = new EventEmitter<void>();

  /** Utilisateur actuel */
  currentUser$: Observable<Utilisateur | null>;

  /** Notifications récentes */
  recentNotifications$: Observable<AppNotification[]>;

  /** Thème actuel */
  currentTheme: ThemeMode = 'light';

  private store = inject(Store);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  constructor() {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.recentNotifications$ = this.store.select(selectRecentNotifications);
  }

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  /**
   * Retourne l'icône pour un type de notification
   */
  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      PLEIN: 'delete',
      ENDOMMAGE: 'warning',
      PANNE: 'build_circle',
      INCIDENT: 'error',
      NOUVELLE_TACHE: 'assignment',
    };
    return icons[type] || 'notifications';
  }

  /**
   * Change le thème
   */
  setTheme(theme: ThemeMode): void {
    this.themeService.setTheme(theme);
  }

  /**
   * Navigue vers la page notifications
   */
  goToNotifications(): void {
    this.router.navigate(['/shared/notifications']);
  }

  /**
   * Navigue vers la page profil
   */
  goToProfile(): void {
    this.router.navigate(['/shared/profil']);
  }

  /**
   * Navigue vers la page changement de mot de passe
   */
  goToChangePassword(): void {
    this.router.navigate(['/auth/change-password']);
  }

  /**
   * Déconnexion
   */
  onLogout(): void {
    this.store.dispatch(logout());
  }

  /**
   * Met à jour le titre de la page
   */
  setPageTitle(title: string): void {
    this.pageTitle = title;
  }
}
