/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import {
  selectPaginatedNotifications,
  selectNotificationPageIndex,
  selectNotificationTotalPages,
  setPageIndex,
  AppNotification,
  TypeNotif,
  selectNotificationsLoading,
  PointDeCollecte,
  Tournee,
  Vehicule,
  selectAllNotifications,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  LoadingSpinnerComponent,
  EmptyStateComponent,
  DateRelativePipe,
  EnumLabelPipe,
} from '@smart-waste-management/shared/ui';

/**
 * Composant page Notifications
 * Affiche la liste complète des notifications avec pagination
 */
@Component({
  selector: 'lib-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatPaginatorModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    DateRelativePipe,
    EnumLabelPipe,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
/**
 * Page Liste des notifications
 * Affiche toutes les notifications avec pagination, icônes et détails contextuels selon leur type.
 */
export class NotificationsComponent implements OnDestroy {
  private store = inject(Store);

  /** Toutes les notifications */
  allNotifications$: Observable<AppNotification[]> = this.store.select(
    selectAllNotifications
  );

  /** Notifications paginées */
  paginatedNotifications$: Observable<AppNotification[]>;

  /** Index de page actuel */
  pageIndex$: Observable<number>;

  /** Nombre total de pages */
  totalPages$: Observable<number>;

  /** Indique si les notifications sont en cours de chargement */
  loading$: Observable<boolean>;
  private destroy$: Subject<void> = new Subject<void>();

  TypeNotif = TypeNotif;

  /** Taille fixe d'une page */
  pageSize = 10;

  points: PointDeCollecte[] = [];
  tournees: Tournee[] = [];
  vehicules: Vehicule[] = [];
  totalPoints = 0;

  constructor() {
    // Sélectionner les notifications depuis le store
    this.paginatedNotifications$ = this.store.select(
      selectPaginatedNotifications
    );
    this.pageIndex$ = this.store.select(selectNotificationPageIndex);
    this.totalPages$ = this.store.select(selectNotificationTotalPages);
    this.loading$ = this.store.select(selectNotificationsLoading);
  }
  /**
   * Gère le changement de page
   * @param event Evénement du paginator Material
   */
  onPageChange(event: PageEvent): void {
    this.store.dispatch(setPageIndex({ pageIndex: event.pageIndex }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Retourne l'icône pour un type de notification
   * @param type Type de notification
   */
  getNotificationIcon(type: TypeNotif): string {
    const icons: Record<TypeNotif, string> = {
      PLEIN: 'delete',
      ENDOMMAGE: 'warning',
      PANNE_VEHICULE: 'build_circle',
      INCIDENT: 'error',
      NOUVELLE_TACHE: 'assignment',
    };
    return icons[type] || 'notifications';
  }

  /**
   * Retourne la classe CSS pour un type de notification
   * @param type Type de notification
   */
  getNotificationClass(type: TypeNotif): string {
    return type.toLowerCase().replace(/_/g, '-');
  }

  isPlein(
    n: AppNotification
  ): n is Extract<AppNotification, { type: TypeNotif.PLEIN }> {
    // console.log('isPlein check:', n);
    return n.type === TypeNotif.PLEIN;
  }

  isEndommage(
    n: AppNotification
  ): n is Extract<AppNotification, { type: TypeNotif.ENDOMMAGE }> {
    // console.log('isEndommage check:', n);
    return n.type === TypeNotif.ENDOMMAGE;
  }

  isPanneVehicule(
    n: AppNotification
  ): n is Extract<AppNotification, { type: TypeNotif.PANNE_VEHICULE }> {
    // console.log('isPanneVehicule check:', n);
    return n.type === TypeNotif.PANNE_VEHICULE;
  }

  isIncident(
    n: AppNotification
  ): n is Extract<AppNotification, { type: TypeNotif.INCIDENT }> {
    // console.log('isIncident check:', n);
    return n.type === TypeNotif.INCIDENT;
  }

  isNouvelleTache(
    n: AppNotification
  ): n is Extract<AppNotification, { type: TypeNotif.NOUVELLE_TACHE }> {
    // console.log('isNouvelleTache check:', n);
    return n.type === TypeNotif.NOUVELLE_TACHE;
  }
}
