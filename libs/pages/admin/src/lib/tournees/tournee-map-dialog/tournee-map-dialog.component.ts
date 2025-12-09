/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Tournee,
  selectTourneeById,
} from '@smart-waste-management/shared/data-access';
import {
  LeafletMapComponent,
  MapMarker,
  MapPolyline,
} from '@smart-waste-management/shared/ui';
import { GpsSimulatorService } from '@smart-waste-management/shared/utils';
import * as L from 'leaflet';

/**
 * Dialog pour afficher la carte d'une tournée
 */
@Component({
  selector: 'lib-tournee-map-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    LeafletMapComponent,
  ],
  templateUrl: './tournee-map-dialog.component.html',
  styleUrl: './tournee-map-dialog.component.css',
})
export class TourneeMapDialogComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<TourneeMapDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as Tournee;
  private store = inject(Store);
  private gpsSimulator = inject(GpsSimulatorService);

  tournee: Tournee;
  markers: MapMarker[] = [];
  polylines: MapPolyline[] = [];
  mapCenter = { latitude: 34.7065, longitude: 10.7487 };

  private destroy$ = new Subject<void>();

  constructor() {
    this.tournee = this.data;
  }

  ngOnInit(): void {
    // Configure les marqueurs pour les points de collecte
    this.markers = this.tournee.pointsDeCollecte.map((point, index) => ({
      position: point.localisation,
      tooltip: `Point ${index + 1}: ${
        point.typeDechet
      } (${point.niveauRemplissage.toFixed(0)}%)`,
      icon: this.getPointIcon(index + 1),
      data: point,
    }));

    // Ajoute le marqueur du véhicule si position actuelle disponible
    if (this.tournee.positionActuelle) {
      this.markers.push({
        position: this.tournee.positionActuelle,
        tooltip: `Véhicule ${this.tournee.vehicule.matricule}`,
        icon: this.getVehicleIcon(),
        data: null,
      });
    }

    // Configure le circuit
    this.polylines = [
      {
        points: this.tournee.pointsDeCollecte.map((p) => p.localisation),
        color: '#2e7d32',
      },
    ];

    // Centre la carte sur le premier point
    if (this.tournee.pointsDeCollecte.length > 0) {
      this.mapCenter = this.tournee.pointsDeCollecte[0].localisation;
    }

    // Démarre la simulation GPS si la tournée est en cours
    if (
      this.tournee.statut === 'EN_COURS' &&
      !this.gpsSimulator.isSimulationActive(this.tournee.id)
    ) {
      this.gpsSimulator
        .startSimulation({
          tourneeId: this.tournee.id,
          waypoints: this.tournee.pointsDeCollecte.map((p) => p.localisation),
          speed: 30,
          updateInterval: 5000,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }

    // Écoute les mises à jour de position
    this.store
      .select(selectTourneeById(this.tournee.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe((tournee) => {
        if (tournee?.positionActuelle) {
          // Met à jour la position du véhicule
          const vehicleMarker = this.markers.find((m) => m.data === null);
          if (vehicleMarker) {
            vehicleMarker.position = tournee.positionActuelle;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getPointIcon(number: number): L.DivIcon {
    return L.divIcon({
      html: `
        <div style="
          background-color: #2e7d32;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${number}</div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      className: '',
    });
  }

  private getVehicleIcon(): L.DivIcon {
    return L.divIcon({
      html: `
        <div style="
          background-color: #0277bd;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        ">🚛</div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      className: '',
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
