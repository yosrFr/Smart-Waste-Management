/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  inject,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { filter, map, Observable, Subscription } from 'rxjs';
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
  /** Événement pour toggle le sidebar */
  @Output() toggleSidebar = new EventEmitter<void>();

  /** Utilisateur actuel */
  currentUser$: Observable<Utilisateur | null>;

  /** Notifications récentes */
  recentNotifications$: Observable<AppNotification[]>;

  /** Thème actuel */
  currentTheme: ThemeMode = 'light';

  /** Titre de la page actuelle */
  pageTitle = '';

  private store = inject(Store);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  private routerSubscription?: Subscription;

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

    // Mise à jour initiale du titre au chargement
    this.pageTitle = this.getDeepestTitle(this.router.routerState.root) || '';

    // Ensuite, mise à jour à chaque changement de route
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.pageTitle =
          this.getDeepestTitle(this.router.routerState.root) || '';
      });
  }

  /**
   * Fonction récursive pour obtenir la route la plus profonde
   * @param route route actuelle
   * @returns titre de la route la plus profonde ou null
   */
  private getDeepestTitle(route: ActivatedRoute): string | null {
    if (route.snapshot.data && route.snapshot.data['title']) {
      return route.snapshot.data['title'];
    }

    for (const child of route.children) {
      const title = this.getDeepestTitle(child);
      if (title) {
        return title;
      }
    }

    return null;
  }

  /**
   * Ferme tous les menus ouverts, à l’exception de celui éventuellement spécifié
   * @param except Le menu à laisser ouvert
   */
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

  /**
   * Gère l’ouverture d’un menu en fermant tous les autres
   * @param menu Le menu qui vient d’être ouvert
   */
  onMenuOpened(menu: 'notification' | 'theme' | 'user'): void {
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
}
