/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  selectAllPointsCollecte,
  selectPointsCollecteLoading,
  loadPointsCollecte,
  deletePointCollecte,
  PointDeCollecte,
  loadNotifications,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  TableColumn,
  TableAction,
  LoadingSpinnerComponent,
  ConfirmDialogService,
} from '@smart-waste-management/shared/ui';
import { PointCollecteFormDialogComponent } from './points-de-collecte-form-dialog/points-de-collecte-form-dialog.component';
import { PointsCollecteTableComponent } from './points-de-collecte-table/points-de-collecte-table.component';
import { PointsCollecteMapComponent } from './points-de-collecte-map/points-de-collecte-map.component';

/**
 * Vue possible pour les points de collecte
 */
type ViewMode = 'table' | 'map';

/**
 * Composant page Points de collecte
 */
@Component({
  selector: 'lib-points-collecte',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    PointsCollecteTableComponent,
    PointsCollecteMapComponent,
  ],
  templateUrl: './points-de-collecte.component.html',
})
export class PointsCollecteComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private confirmDialogService = inject(ConfirmDialogService);

  viewMode: ViewMode = 'table';
  points: PointDeCollecte[] = [];
  totalPoints = 0;
  loading$: Observable<boolean>;

  // Configuration du tableau
  tableColumns: TableColumn<PointDeCollecte>[] = [
    {
      key: 'localisation',
      label: 'Localisation',
      sortable: false,
      customTemplate: (point) =>
        `${point.localisation.latitude.toFixed(
          4
        )}, ${point.localisation.longitude.toFixed(4)}`,
    },
    {
      key: 'typeDechet',
      label: 'Type de déchet',
      sortable: true,
    },
    {
      key: 'capacite',
      label: 'Capacité',
      sortable: true,
    },
    {
      key: 'niveauRemplissage',
      label: 'Niveau de remplissage (%)',
      sortable: true,
      customTemplate: (point) => `${point.niveauRemplissage.toFixed(0)}%`,
    },
    {
      key: 'etatConteneur',
      label: 'État',
      sortable: true,
    },
  ];

  tableActions: TableAction<PointDeCollecte>[] = [
    {
      icon: 'edit',
      action: (point) => this.editPoint(point),
    },
    {
      icon: 'delete',
      action: (point) => this.deletePoint(point),
    },
  ];

  // Configuration de la carte
  mapCenter = { latitude: 34.7442, longitude: 10.7487 };

  private destroy$ = new Subject<void>();

  constructor() {
    this.loading$ = this.store.select(selectPointsCollecteLoading);
  }

  ngOnInit(): void {
    // Charge les points de collecte
    this.store.dispatch(loadPointsCollecte());
    this.store.dispatch(loadNotifications());

    // Souscrit aux points de collecte
    this.store
      .select(selectAllPointsCollecte)
      .pipe(takeUntil(this.destroy$))
      .subscribe((points) => {
        this.points = points;
        this.totalPoints = points.length;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Ouvre le dialog pour ajouter un point
   */
  addPoint(): void {
    const dialogRef = this.dialog.open(PointCollecteFormDialogComponent, {
      width: '600px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Point de collecte ajouté avec succès', 'Fermer', {
          duration: 3000,
        });
      }
    });
  }

  /**
   * Ouvre le dialog pour modifier un point
   */
  editPoint(point: PointDeCollecte): void {
    const dialogRef = this.dialog.open(PointCollecteFormDialogComponent, {
      width: '600px',
      data: point,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Point de collecte modifié avec succès', 'Fermer', {
          duration: 3000,
        });
      }
    });
  }

  /**
   * Supprime un point après confirmation
   */
  deletePoint(point: PointDeCollecte): void {
    this.confirmDialogService
      .confirmDelete(`Point ${point.id}`)
      .subscribe((confirmed) => {
        if (confirmed) {
          this.store.dispatch(deletePointCollecte({ id: point.id }));
          this.snackBar.open('Point de collecte supprimé', 'Fermer', {
            duration: 3000,
          });
        }
      });
  }

  /**
   * Gère le clic sur un marqueur de la carte
   */
  onMarkerClick(point: PointDeCollecte): void {
    this.editPoint(point);
  }
}
