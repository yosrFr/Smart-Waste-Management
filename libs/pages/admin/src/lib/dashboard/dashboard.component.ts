/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  selectAllPointsCollecte,
  loadPointsCollecte,
  loadVehicules,
  loadTournees,
  Tournee,
  StatutTournee,
  selectPointsCollecteByEtat,
  EtatConteneur,
  selectVehiculesByStatut,
  StatutVehicule,
  selectTourneesAujourdhui,
  selectTourneesAujourdhuiByStatut,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  StatCardComponent,
  StatusBadgeComponent,
  EnumLabelPipe,
} from '@smart-waste-management/shared/ui';
import { TourneeMapDialogComponent } from '../tournees/tournee-map-dialog/tournee-map-dialog.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Composant Dashboard Admin
 */
@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    PageHeaderComponent,
    StatCardComponent,
    StatusBadgeComponent,
    EnumLabelPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  // Statistiques
  totalPoints = 0;
  pointsPleins = 0;
  pointsEndommages = 0;
  vehiculesDisponibles = 0;
  vehiculesEnReparation = 0;
  vehiculesEnMission = 0;
  tourneesEnCours = 0;
  tourneesTerminees = 0;
  tourneesNonCommencees = 0;

  // Tournées du jour
  tourneesAujourdhui: Tournee[] = [];
  displayedColumns = ['vehicule', 'typeDechet', 'statut', 'actions'];

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Charge les données
    this.store.dispatch(loadPointsCollecte());
    this.store.dispatch(loadVehicules());
    this.store.dispatch(loadTournees());

    // Souscrit aux statistiques
    this.store
      .select(selectAllPointsCollecte)
      .pipe(takeUntil(this.destroy$))
      .subscribe((points) => {
        this.totalPoints = points.length;
      });

    this.store
      .select(selectPointsCollecteByEtat(EtatConteneur.PLEIN))
      .pipe(takeUntil(this.destroy$))
      .subscribe((points) => {
        this.pointsPleins = points.length;
      });

    this.store
      .select(selectPointsCollecteByEtat(EtatConteneur.ENDOMMAGE))
      .pipe(takeUntil(this.destroy$))
      .subscribe((points) => {
        this.pointsEndommages = points.length;
      });

    this.store
      .select(selectVehiculesByStatut(StatutVehicule.ACTIF))
      .pipe(takeUntil(this.destroy$))
      .subscribe((vehicules) => {
        this.vehiculesDisponibles = vehicules.length;
      });

    this.store
      .select(selectVehiculesByStatut(StatutVehicule.EN_REPARATION))
      .pipe(takeUntil(this.destroy$))
      .subscribe((vehicules) => {
        this.vehiculesEnReparation = vehicules.length;
      });

    this.store
      .select(selectVehiculesByStatut(StatutVehicule.EN_MISSION))
      .pipe(takeUntil(this.destroy$))
      .subscribe((vehicules) => {
        this.vehiculesEnMission = vehicules.length;
      });

    this.store
      .select(selectTourneesAujourdhui)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tournees) => {
        this.tourneesAujourdhui = tournees;
      });

    this.store
      .select(selectTourneesAujourdhuiByStatut(StatutTournee.EN_COURS))
      .pipe(takeUntil(this.destroy$))
      .subscribe((tournees) => {
        this.tourneesEnCours = tournees.length;
      });

    this.store
      .select(selectTourneesAujourdhuiByStatut(StatutTournee.TERMINEE))
      .pipe(takeUntil(this.destroy$))
      .subscribe((tournees) => {
        this.tourneesTerminees = tournees.length;
      });

    this.store
      .select(selectTourneesAujourdhuiByStatut(StatutTournee.NON_COMMENCEE))
      .pipe(takeUntil(this.destroy$))
      .subscribe((tournees) => {
        this.tourneesNonCommencees = tournees.length;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Retourne la couleur du badge selon le statut
   */
  getStatutColor(
    statut: StatutTournee
  ): 'success' | 'warning' | 'danger' | 'info' {
    switch (statut) {
      case StatutTournee.TERMINEE:
        return 'success';
      case StatutTournee.EN_COURS:
        return 'warning';
      default:
        return 'info';
    }
  }

  /**
   * Navigue vers la page tournées
   */
  goToTournees(): void {
    this.router.navigate(['/admin/tournees']);
  }

  /**
   * Affiche la carte d'une tournée
   */
  viewTourneeMap(tournee: Tournee): void {
    this.dialog.open(TourneeMapDialogComponent, {
      width: '90vw',
      height: '80vh',
      maxWidth: '1200px',
      data: tournee,
    });
  }
}
