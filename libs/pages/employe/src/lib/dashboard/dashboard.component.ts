/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  selectCurrentUser,
  loadTournees,
  Tournee,
  StatutTournee,
  selectTourneesAujourdhuiByEmployeIdAndStatut,
  selectTourneesLoading,
  selectTourneesAujourdhuiByEmployeId,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  StatCardComponent,
  StatusBadgeComponent,
  EnumLabelPipe,
  LoadingSpinnerComponent,
  EmptyStateComponent,
} from '@smart-waste-management/shared/ui';
import { TourneeMapDialogComponent } from '../../../../admin/src/lib/tournees/tournee-map-dialog/tournee-map-dialog.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Composant Dashboard Employeé
 * Affiche statistiques et tournées du jour
 */
@Component({
  selector: 'lib-employee-dashboard',
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
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: 'dashboard.component.html',
  styleUrl: 'dashboard.component.css',
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  userName = '';
  tourneesAujourdhui = 0;
  tourneesTerminees = 0;

  mesTourneesAujourdhui$!: Observable<Tournee[]>;
  loading$!: Observable<boolean>;

  displayedColumns = [
    'dateDebut',
    'dateFin',
    'vehicule',
    'points',
    'typeDechet',
    'statut',
    'actions',
  ];

  private destroy$ = new Subject<void>();
  private currentUserId = '';

  ngOnInit(): void {
    // Dispatch pour charger les tournées
    this.store.dispatch(loadTournees());

    // Observable de loading
    this.loading$ = this.store.select(selectTourneesLoading);

    // Récupère l'utilisateur actuel et charge ses tournées
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.userName = user.prenom;
          this.currentUserId = user.id;
          this.loadEmployeeTournees(user.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charger les tournées d'un employé
   * @param employeId id de l'employé
   */
  private loadEmployeeTournees(employeId: string): void {
    this.mesTourneesAujourdhui$ = this.store.select(
      selectTourneesAujourdhuiByEmployeId(employeId)
    );

    // Nombre total de tournées aujourd'hui
    this.store
      .select(selectTourneesAujourdhuiByEmployeId(employeId))
      .pipe(takeUntil(this.destroy$))
      .subscribe((tournees) => {
        this.tourneesAujourdhui = tournees.length;
      });

    // Nombre de tournées terminées aujourdhui
    this.store
      .select(
        selectTourneesAujourdhuiByEmployeIdAndStatut(
          employeId,
          StatutTournee.TERMINEE
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((tourneesTerminees) => {
        this.tourneesTerminees = tourneesTerminees.length;
      });
  }

  /**
   * Détermine la couleur d'un startut de tournée
   * @param statut la statut de la tournée
   * @returns 'success' | 'warning' | 'info'
   */
  getStatutColor(statut: StatutTournee): 'success' | 'warning' | 'info' {
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
   * Naviger à la page mes tournées
   */
  goToMesTournees(): void {
    this.router.navigate(['/employee/mes-tournees']);
  }

  /**
   * Renvoir la map d'une tournée spécifique
   * @param tournee tournée spécifique
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
