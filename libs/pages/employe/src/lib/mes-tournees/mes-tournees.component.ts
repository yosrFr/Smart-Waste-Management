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
  selectCurrentUser,
  selectTourneesByEmployeId,
  loadTournees,
  Tournee,
  StatutTournee,
  selectTourneesLoading,
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
import { TourneeMapDialogComponent } from '../../../../admin/src/lib/tournees/tournee-map-dialog/tournee-map-dialog.component';

/**
 * Composant Mes Tournées (Employee)
 * Il utilise des onglets pour séparer les tournées selon leur statut :
 * - Non commencées
 * - En cours
 * - Terminées
 * Chaque onglet contient un tableau avec des colonnes et actions définies
 * Permet également de visualiser une tournée sur une carte via un dialogue
 */
@Component({
  selector: 'lib-mes-tournees',
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
  templateUrl: './mes-tournees.component.html',
})
export class MesTourneesComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  totalTournees = 0;
  selectedTabIndex = 0;

  tourneesNonCommencees: Tournee[] = [];
  tourneesEnCours: Tournee[] = [];
  tourneesTerminees: Tournee[] = [];

  loading$!: Observable<boolean>;

  /** Configuration des onglets */
  tabs: Tab[] = [
    { label: 'Non commencées', value: 'NON_COMMENCEE' },
    { label: 'En cours', value: 'EN_COURS' },
    { label: 'Terminées', value: 'TERMINEE' },
  ];

  /** Définition des colonnes du tableau */
  tableColumns: TableColumn<Tournee>[] = [
    {
      key: 'dateDebut',
      label: 'Date début',
      sortable: true,
      customTemplate: (t) => new Date(t.dateDebut).toLocaleString('fr-FR'),
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
      key: 'pointsDeCollecte',
      label: 'Points',
      customTemplate: (t) => `${t.pointsDeCollecte.length} points`,
    },
  ];

  /** Actions disponibles sur chaque ligne de tableau */
  tableActions: TableAction<Tournee>[] = [
    {
      icon: 'map',
      action: (tournee) => this.viewOnMap(tournee),
    },
  ];

  private destroy$ = new Subject<void>();

  /**
   * Charger les tournées de l'employé courant
   */
  ngOnInit(): void {
    this.store.dispatch(loadTournees());

    // Observable de loading
    this.loading$ = this.store.select(selectTourneesLoading);

    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.loadEmployeeTournees(user.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les tournées d'un employé et les classe par statut
   * @param employeId ID de l'employé
   */
  private loadEmployeeTournees(employeId: string): void {
    this.store
      .select(selectTourneesByEmployeId(employeId))
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

  /**
   * Ouvre un dialogue affichant la tournée sur une carte
   * @param tournee Tournée à visualiser
   */
  viewOnMap(tournee: Tournee): void {
    this.dialog.open(TourneeMapDialogComponent, {
      width: '90vw',
      height: '400px',
      maxWidth: '1200px',
      data: tournee,
    });
  }
}
