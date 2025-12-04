/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
  selectCurrentUser,
  selectTourneesByEmployeId,
  selectTourneesAujourdhui,
  loadTournees,
  Tournee,
  StatutTournee,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  StatCardComponent,
  StatusBadgeComponent,
  EnumLabelPipe,
} from '@smart-waste-management/shared/ui';
import { TourneeMapDialogComponent } from '../../../../admin/src/lib/tournees/tournee-map-dialog.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Composant Dashboard Employee
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
  mesTourneesAujourdhui: Tournee[] = [];
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
    this.store.dispatch(loadTournees());

    // Récupère l'utilisateur actuel
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.userName = user.prenom;
          this.currentUserId = user.id;

          // Charge les tournées de cet employé
          this.loadEmployeeTournees(user.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEmployeeTournees(employeId: string): void {
    this.store
      .select(selectTourneesByEmployeId(employeId))
      .pipe(takeUntil(this.destroy$))
      .subscribe((tournees) => {
        const today = new Date().toISOString().split('T')[0];

        this.mesTourneesAujourdhui = tournees.filter((t) =>
          t.dateDeb.startsWith(today)
        );

        this.tourneesAujourdhui = this.mesTourneesAujourdhui.length;

        this.tourneesTerminees = tournees.filter(
          (t) => t.statut === StatutTournee.TERMINEE
        ).length;
      });
  }

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

  goToMesTournees(): void {
    this.router.navigate(['/employee/mes-tournees']);
  }

  viewTourneeMap(tournee: Tournee): void {
    this.dialog.open(TourneeMapDialogComponent, {
      width: '90vw',
      height: '80vh',
      maxWidth: '1200px',
      data: tournee,
    });
  }
}
