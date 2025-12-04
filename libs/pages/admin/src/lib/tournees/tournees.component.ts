/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  selectAllTournees,
  selectTourneesLoading,
  loadTournees,
  Tournee,
  StatutTournee,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  DataTableComponent,
  TableColumn,
  TableAction,
  TabsComponent,
  Tab,
  LoadingSpinnerComponent,
  StatusBadgeComponent,
  EnumLabelPipe,
} from '@smart-waste-management/shared/ui';
import { TourneeMapDialogComponent } from './tournee-map-dialog.component';

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
    StatusBadgeComponent,
    EnumLabelPipe,
  ],
  templateUrl: './tournees.component.html',
})
export class TourneesComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  private destroy$ = new Subject<void>();

  totalTournees = 0;
  loading$ = this.store.select(selectTourneesLoading);
  selectedTabIndex = 0;

  tourneesNonCommencees: Tournee[] = [];
  tourneesEnCours: Tournee[] = [];
  tourneesTerminees: Tournee[] = [];

  tabs: Tab[] = [
    { label: 'Non commencées', value: StatutTournee.NON_COMMENCEE },
    { label: 'En cours', value: StatutTournee.EN_COURS },
    { label: 'Terminées', value: StatutTournee.TERMINEE },
  ];

  tableColumns: TableColumn<Tournee>[] = [
    {
      key: 'dateDebut',
      label: 'Date début',
      sortable: true,
      customTemplate: (t) => new Date(t.dateDeb).toLocaleString('fr-FR'),
    },
    {
      key: 'dateFin',
      label: 'Date fin',
      sortable: true,
      customTemplate: (t) => new Date(t.dateFin).toLocaleString('fr-FR'),
    },
    {
      key: 'vehicule',
      label: 'Véhicule',
      customTemplate: (t) => t.vehicule.matricule,
    },
    {
      key: 'employe',
      label: 'Employé',
      customTemplate: (t) => `${t.employe.prenom} ${t.employe.nom}`,
    },
    {
      key: 'pointsDeCollecte',
      label: 'Points',
      customTemplate: (t) => `${t.pointsDeCollecte.length} points`,
    },
  ];

  tableActions: TableAction<Tournee>[] = [
    {
      icon: 'map',
      action: (tournee) => this.viewOnMap(tournee),
    },
  ];

  ngOnInit(): void {
    this.store.dispatch(loadTournees());

    this.store
      .select(selectAllTournees)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tournees) => {
        this.totalTournees = tournees.length;

        this.tourneesNonCommencees = tournees.filter(
          (t) => t.statut === StatutTournee.NON_COMMENCEE
        );
        this.tourneesEnCours = tournees.filter(
          (t) => t.statut === StatutTournee.EN_COURS
        );
        this.tourneesTerminees = tournees.filter(
          (t) => t.statut === StatutTournee.TERMINEE
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
