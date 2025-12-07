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
  EtatConteneur,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  DataTableComponent,
  TableColumn,
  TableAction,
  LeafletMapComponent,
  MapMarker,
  LoadingSpinnerComponent,
  ConfirmDialogService,
} from '@smart-waste-management/shared/ui';
import { PointCollecteFormDialogComponent } from './points-de-collecte-form-dialog.component';
import * as L from 'leaflet';

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
    DataTableComponent,
    LeafletMapComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './points-de-collecte.component.html',
  styleUrl: './points-de-collecte.component.css',
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
      key: 'niveauRemplissage',
      label: 'Niveau de remplissage (%)',
      sortable: true,
      customTemplate: (point) => `${point.niveauRemplissage.toFixed(0)}%`,
    },
    {
      key: 'etat',
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
  mapMarkers: MapMarker[] = [];

  private destroy$ = new Subject<void>();

  constructor() {
    this.loading$ = this.store.select(selectPointsCollecteLoading);
  }

  ngOnInit(): void {
    // Charge les points de collecte
    this.store.dispatch(loadPointsCollecte());

    // Souscrit aux points de collecte
    this.store
      .select(selectAllPointsCollecte)
      .pipe(takeUntil(this.destroy$))
      .subscribe((points) => {
        this.points = points;
        this.totalPoints = points.length;
        this.updateMapMarkers(points);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Met à jour les marqueurs sur la carte
   */
  private updateMapMarkers(points: PointDeCollecte[]): void {
    // Filter out points without valid coordinates
    const valid = points.filter(
      (p) =>
        p &&
        p.localisation &&
        Number.isFinite(p.localisation.latitude) &&
        Number.isFinite(p.localisation.longitude)
    );

    this.mapMarkers = valid.map((point) => ({
      position: point.localisation,
      tooltip: this.getPointTooltip(point),
      icon: this.getMarkerIcon(point),
      data: point,
    }));
  }

  /**
   * Génère le tooltip pour un point
   */
  private getPointTooltip(point: PointDeCollecte): string {
    return `
      Type: ${point.typeDechet}
      Niveau: ${point.niveauRemplissage.toFixed(0)}%
      État: ${point.etat}
    `;
  }

  /**
   * Retourne l'icône du marqueur selon l'état et le niveau
   */
  private getMarkerIcon(point: PointDeCollecte): L.DivIcon {
    // Base colors by waste type
    const baseColors: Record<string, string> = {
      PLASTIQUE: '#29b6f6',
      METAUX: '#ef5350',
      ALIMENTAIRE: '#ffcc55ff',
      VERRE: '#66bb6a',
      AUTRE: '#757575',
      ENDOMMAGE: '#000',
    };

    const darkerColor: Record<string, string> = {
      PLASTIQUE: '#01579b',
      METAUX: '#b71c1c',
      ALIMENTAIRE: '#FFB300',
      VERRE: '#2e7d32',
      AUTRE: '#424242',
    };

    const typeKey = point.typeDechet as unknown as string;
    const base = baseColors[typeKey];
    const darker = darkerColor[typeKey];

    let color = base;

    // Adjust by state intensity
    if (point.etat === EtatConteneur.ENDOMMAGE) {
      color = '#000';
    } else if (point.etat === EtatConteneur.PLEIN) {
      color = darker;
    } else {
      color = base;
    }

    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: '',
    });
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
  onMarkerClick(marker: MapMarker): void {
    const point = marker.data as PointDeCollecte;
    this.editPoint(point);
  }
}
