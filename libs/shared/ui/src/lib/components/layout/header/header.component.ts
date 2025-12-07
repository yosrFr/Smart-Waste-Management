/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  inject,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
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
  private activatedRoute = inject(ActivatedRoute);
  private themeService = inject(ThemeService);

  @ViewChild('notificationTrigger') notificationTrigger?: MatMenuTrigger;
  @ViewChild('themeTrigger') themeTrigger?: MatMenuTrigger;
  @ViewChild('userTrigger') userTrigger?: MatMenuTrigger;

  constructor() {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.recentNotifications$ = this.store.select(selectRecentNotifications);
  }

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
    // Met à jour le titre de la page en fonction du route data ou de l'URL
    // Use NavigationEnd with setTimeout to ensure route tree is updated
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        // Use setTimeout to allow Angular to update the route tree
        setTimeout(() => {
          const titleFromData = this.getTitleFromRouteData();
          if (titleFromData) {
            this.pageTitle = titleFromData;
          } else {
            const url = this.router.url;
            this.pageTitle = this.computeTitleFromUrl(url);
          }
        }, 0);
      });
  }

  private closeAllMenusExcept(except?: 'notification' | 'theme' | 'user') {
    if (except !== 'notification' && this.notificationTrigger?.menuOpen) {
      this.notificationTrigger.closeMenu();
    }
    if (except !== 'theme' && this.themeTrigger?.menuOpen) {
      this.themeTrigger.closeMenu();
    }
    if (except !== 'user' && this.userTrigger?.menuOpen) {
      this.userTrigger.closeMenu();
    }
  }

  // Called when a menu is opened by MatMenuTrigger
  onMenuOpened(menu: 'notification' | 'theme' | 'user'): void {
    // Close other menus once this one opens
    this.closeAllMenusExcept(menu);
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

  private getTitleFromRouteData(): string | null {
    let route = this.activatedRoute;
    // Traverse to the deepest child route
    while (route.firstChild) {
      route = route.firstChild;
    }
    // Check current route's data
    const snapshot = route.snapshot;
    if (snapshot && snapshot.data && snapshot.data['title']) {
      return snapshot.data['title'];
    }
    return null;
  }

  private computeTitleFromUrl(url: string): string {
    if (!url || url === '/' || url === '/auth/login') return 'Dashboard';
    // Remove query params and hash
    const clean = url.split('?')[0].split('#')[0];
    const parts = clean.split('/').filter(Boolean);
    if (parts.length === 0) return 'Dashboard';
    // Use the last segment as page key
    const last = parts[parts.length - 1];
    // Map common routes to nicer titles
    const map: Record<string, string> = {
      dashboard: 'Dashboard',
      'points-collecte': 'Points de collecte',
      vehicules: 'Véhicules',
      employes: 'Employés',
      tournees: 'Tournées',
      profil: 'Profil',
      notifications: 'Notifications',
      'mes-tournees': 'Mes tournées',
      login: 'Connexion',
    };

    if (map[last]) return map[last];

    // Fallback: convert kebab-case / snake_case to Title Case
    return last.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  }
}
