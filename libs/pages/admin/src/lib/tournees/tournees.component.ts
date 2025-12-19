/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  selectAllTournees,
  selectTourneesLoading,
  loadTournees,
  Tournee,
  StatutTournee,
  selectTourneesByStatut,
  loadEmployes,
  loadVehicules,
  loadPointsCollecte,
  loadNotifications,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  DataTableComponent,
  TableColumn,
  TableAction,
  TabsComponent,
  Tab,
  LoadingSpinnerComponent,
} from '@smart-waste-management/shared/ui';
import { TourneeMapDialogComponent } from './tournee-map-dialog/tournee-map-dialog.component';

/**
 * Composant page Tournées Admin
 */
@Component({
  selector: 'lib-tournees',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    DataTableComponent,
    TabsComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './tournees.component.html',
})
export class TourneesComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  private destroy$ = new Subject<void>();

  totalTournees = 0;
  loading$ = this.store.select(selectTourneesLoading);

  tourneesNonCommencees$!: Observable<Tournee[]>;
  tourneesEnCours$!: Observable<Tournee[]>;
  tourneesTerminees$!: Observable<Tournee[]>;
  selectedTabIndex = 0;

  tabs: Tab[] = [
    { label: 'Non commencées', value: 'NON_COMMENCEE' },
    { label: 'En cours', value: 'EN_COURS' },
    { label: 'Terminées', value: 'TERMINEE' },
  ];

  tableColumns: TableColumn<Tournee>[] = [
    {
      key: 'dateDebut',
      label: 'Date début',
      sortable: true,
      customTemplate: (t) => t.dateDebut.toLocaleString('fr-FR'),
    },
    {
      key: 'dateFin',
      label: 'Date fin',
      sortable: true,
      customTemplate: (t) => t.dateFin.toLocaleString('fr-FR'),
    },
    {
      key: 'vehicule',
      label: 'Véhicule',
      customTemplate: (t) => t.vehicule?.matricule || 'N/A',
    },
    {
      key: 'employe',
      label: 'Employé',
      customTemplate: (t) => `${t.employe?.prenom} ${t.employe?.nom}`,
    },
    {
      key: 'pointsDeCollecte',
      label: 'Points',
      customTemplate: (t) => `${t.pointsDeCollecteIds.length - 1} points`,
    },
  ];

  /** Actions disponibles sur chaque ligne de tableau */
  tableActions: TableAction<Tournee>[] = [
    {
      icon: 'map',
      action: (tournee) => this.viewOnMap(tournee),
    },
  ];

  ngOnInit(): void {
    this.store.dispatch(loadTournees());
    this.store.dispatch(loadEmployes());
    this.store.dispatch(loadVehicules());
    this.store.dispatch(loadPointsCollecte());
    this.store.dispatch(loadNotifications());

    this.store
      .select(selectAllTournees)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tournees) => {
        this.totalTournees = tournees.length;

        this.tourneesNonCommencees$ = this.store.select(
          selectTourneesByStatut(StatutTournee.NON_COMMENCEE)
        );
        this.tourneesEnCours$ = this.store.select(
          selectTourneesByStatut(StatutTournee.EN_COURS)
        );
        this.tourneesTerminees$ = this.store.select(
          selectTourneesByStatut(StatutTournee.TERMINEE)
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewOnMap(tournee: Tournee): void {
    this.dialog.open(TourneeMapDialogComponent, {
      width: '90vw',
      height: '80vh',
      maxWidth: '1200px',
      data: tournee,
    });
  }
}
