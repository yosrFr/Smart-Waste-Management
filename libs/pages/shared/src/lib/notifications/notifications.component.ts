/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import {
  selectPaginatedNotifications,
  selectAllNotifications,
  selectNotificationPageIndex,
  selectNotificationPageSize,
  selectNotificationTotalPages,
  setPageIndex,
  setPageSize,
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
import { CdkNoDataRow } from '@angular/cdk/table';

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
    CdkNoDataRow,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private store = inject(Store);

  paginatedNotifications$: Observable<AppNotification[]>;
  allNotifications$: Observable<AppNotification[]>;
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  totalPages$: Observable<number>;
  loading$: Observable<boolean>;
  TypeNotif = TypeNotif;

  constructor() {
    this.paginatedNotifications$ = this.store.select(
      selectPaginatedNotifications
    );
    this.allNotifications$ = this.store.select(selectAllNotifications);
    this.pageIndex$ = this.store.select(selectNotificationPageIndex);
    this.pageSize$ = this.store.select(selectNotificationPageSize);
    this.totalPages$ = this.store.select(selectNotificationTotalPages);
    this.loading$ = this.store.select(selectNotificationsLoading);
  }

  ngOnInit(): void {
    // Charge les notifications au montage du composant
    this.store.dispatch(loadNotifications());
  }

  /**
   * Gère le changement de page
   */
  onPageChange(event: PageEvent): void {
    this.store.dispatch(setPageIndex({ pageIndex: event.pageIndex }));
    this.store
      .select(selectNotificationPageSize)
      .pipe(take(1))
      .subscribe((currentSize) => {
        if (event.pageSize !== currentSize) {
          this.store.dispatch(setPageSize({ pageSize: event.pageSize }));
        }
      });
  }

  /**
   * Retourne l'icône pour un type de notification
   */
  getNotificationIcon(type: TypeNotif): string {
    const icons: Record<TypeNotif, string> = {
      PLEIN: 'delete',
      ENDOMMAGE: 'warning',
      PANNE: 'build_circle',
      INCIDENT: 'error',
      NOUVELLE_TACHE: 'assignment',
    };
    return icons[type] || 'notifications';
  }

  /**
   * Retourne la classe CSS pour un type de notification
   */
  getNotificationClass(type: TypeNotif): string {
    return type.toLowerCase().replace(/_/g, '-');
  }

  getNotificationDetails(notification: AppNotification) {
    switch (notification.type) {
      case TypeNotif.PLEIN:
        return (notification as unknown as NotificationConteneurPlein).details;
      case TypeNotif.ENDOMMAGE:
        return (notification as unknown as NotificationConteneurEndommage)
          .details;
      case TypeNotif.PANNE:
        return (notification as unknown as NotificationVehiculeEnPanne).details;
      case TypeNotif.INCIDENT:
        return (notification as unknown as NotificationIncident).details;
      case TypeNotif.NOUVELLE_TACHE:
        return (notification as unknown as NotificationNouvelleTache).details;
      default:
        return null;
    }
  }

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

  isVehicule(
    notification: AppNotification
  ): notification is NotificationVehiculeEnPanne {
    return notification.type === TypeNotif.PANNE;
  }

  isIncident(
    notification: AppNotification
  ): notification is NotificationIncident {
    return notification.type === TypeNotif.INCIDENT;
  }

  isNouvelleTache(
    notification: AppNotification
  ): notification is NotificationNouvelleTache {
    return notification.type === TypeNotif.NOUVELLE_TACHE;
  }
}
