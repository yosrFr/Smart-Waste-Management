/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectPaginatedNotifications,
  selectAllNotifications,
  selectNotificationPageIndex,
  selectNotificationTotalPages,
  setPageIndex,
  AppNotification,
  TypeNotif,
  selectNotificationsLoading,
  loadNotifications,
  NotificationConteneurPlein,
  NotificationConteneurEndommage,
  NotificationVehiculeEnPanne,
  NotificationIncident,
  NotificationNouvelleTache,
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
export class NotificationsComponent implements OnInit {
  private store = inject(Store);

  /** Notifications paginées */
  paginatedNotifications$: Observable<AppNotification[]>;

  /** Toutes les notifications */
  allNotifications$: Observable<AppNotification[]>;

  /** Index de page actuel */
  pageIndex$: Observable<number>;

  /** Nombre total de pages */
  totalPages$: Observable<number>;

  /** Indique si les notifications sont en cours de chargement */
  loading$: Observable<boolean>;

  TypeNotif = TypeNotif;

  /** Taille fixe d'une page */
  pageSize = 10;

  constructor() {
    this.paginatedNotifications$ = this.store.select(
      selectPaginatedNotifications
    );
    this.allNotifications$ = this.store.select(selectAllNotifications);
    this.pageIndex$ = this.store.select(selectNotificationPageIndex);
    this.totalPages$ = this.store.select(selectNotificationTotalPages);
    this.loading$ = this.store.select(selectNotificationsLoading);
  }

  /** Charge les notifications au loading du composant */
  ngOnInit(): void {
    this.store.dispatch(loadNotifications());
  }

  /**
   * Gère le changement de page
   * @param event Evénement du paginator Material
   */
  onPageChange(event: PageEvent): void {
    this.store.dispatch(setPageIndex({ pageIndex: event.pageIndex }));
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

  /**
   * Prend une notification de type inconnu
   * Cherche le type de notification
   * Retourne les détails de cette notification selon son type
   * @param notification une notification reçue qu'on ne connait pas son type
   * @returns Les détails d'un type spécifique de notification
   */
  getNotificationDetails(notification: AppNotification) {
    switch (notification.type) {
      case TypeNotif.PLEIN:
        return (notification as unknown as NotificationConteneurPlein).details;
      case TypeNotif.ENDOMMAGE:
        return (notification as unknown as NotificationConteneurEndommage)
          .details;
      case TypeNotif.PANNE_VEHICULE:
        return (notification as unknown as NotificationVehiculeEnPanne).details;
      case TypeNotif.INCIDENT:
        return (notification as unknown as NotificationIncident).details;
      case TypeNotif.NOUVELLE_TACHE:
        return (notification as unknown as NotificationNouvelleTache).details;
      default:
        return null;
    }
  }

  /**
   * Type guard : vérifie si la notification concerne un conteneur
   * @param notification notification reçue qu'on ne connait pas son type
   * @returns True si la notification de type plein ou endommagé, sinon retourne 0
   */
  isConteneur(
    notification: AppNotification
  ): notification is
    | NotificationConteneurPlein
    | NotificationConteneurEndommage {
    return (
      notification.type === TypeNotif.PLEIN ||
      notification.type === TypeNotif.ENDOMMAGE
    );
  }

  /**
   * Type guard : notification liée à un véhicule
   * @param notification notification reçue qu'on ne connait pas son type
   * @returns True si la notification de type panne, sinon retourne 0
   */
  isVehicule(
    notification: AppNotification
  ): notification is NotificationVehiculeEnPanne {
    return notification.type === TypeNotif.PANNE_VEHICULE;
  }

  /**
   * Type guard : notification liée à un Incident
   * @param notification notification reçue qu'on ne connait pas son type
   * @returns True si la notification de type incident, sinon retourne 0
   */
  isIncident(
    notification: AppNotification
  ): notification is NotificationIncident {
    return notification.type === TypeNotif.INCIDENT;
  }

  /**
   * Type guard : notification liée à une tâche
   * @param notification notification reçue qu'on ne connait pas son type
   * @returns True si la notification de type nouvelle tâche, sinon retourne 0
   */
  isNouvelleTache(
    notification: AppNotification
  ): notification is NotificationNouvelleTache {
    return notification.type === TypeNotif.NOUVELLE_TACHE;
  }
}
