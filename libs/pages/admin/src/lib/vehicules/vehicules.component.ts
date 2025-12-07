/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  selectAllVehicules,
  selectVehiculesLoading,
  loadVehicules,
  deleteVehicule,
  Vehicule,
  StatutVehicule,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  DataTableComponent,
  TableColumn,
  TableAction,
  TabsComponent,
  Tab,
  LoadingSpinnerComponent,
  ConfirmDialogService,
} from '@smart-waste-management/shared/ui';
import { VehiculeFormDialogComponent } from './vehicule-form-dialog.component';

/**
 * Composant page Véhicules
 */
@Component({
  selector: 'lib-vehicules',
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
  templateUrl: './vehicules.component.html',
})
export class VehiculesComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private confirmDialogService = inject(ConfirmDialogService);

  totalVehicules = 0;
  loading$: Observable<boolean>;
  selectedTabIndex = 0;

  // Données par statut
  vehiculesActifs: Vehicule[] = [];
  vehiculesInactifs: Vehicule[] = [];
  vehiculesEnReparation: Vehicule[] = [];
  vehiculesEnMission: Vehicule[] = [];

  // Configuration des tabs
  tabs: Tab[] = [
    { label: 'Actifs', value: 'ACTIF' },
    { label: 'Inactifs', value: 'INACTIF' },
    { label: 'En réparation', value: 'EN_REPARATION' },
    { label: 'En mission', value: 'EN_MISSION' },
  ];

  // Configuration du tableau
  tableColumns: TableColumn<Vehicule>[] = [
    { key: 'matricule', label: 'Matricule', sortable: true },
    { key: 'marque', label: 'Marque', sortable: true },
    {
      key: 'capaciteMax',
      label: 'Capacité max (kg)',
      sortable: true,
      customTemplate: (v) => v.capaciteMax.toLocaleString(),
    },
    {
      key: 'poidsVide',
      label: 'Poids vide (kg)',
      sortable: true,
      customTemplate: (v) => v.poidsVide.toLocaleString(),
    },
    { key: 'typeDechet', label: 'Type de déchet', sortable: true },
  ];

  tableActions: TableAction<Vehicule>[] = [
    {
      icon: 'edit',
      action: (vehicule) => this.editVehicule(vehicule),
    },
    {
      icon: 'delete',
      action: (vehicule) => this.deleteVehicule(vehicule),
    },
  ];

  private destroy$ = new Subject<void>();

  constructor() {
    this.loading$ = this.store.select(selectVehiculesLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadVehicules());

    this.store
      .select(selectAllVehicules)
      .pipe(takeUntil(this.destroy$))
      .subscribe((vehicules) => {
        this.totalVehicules = vehicules.length;

        // Filtre par statut
        this.vehiculesActifs = vehicules.filter(
          (v) => v.statut === StatutVehicule.ACTIF
        );
        this.vehiculesInactifs = vehicules.filter(
          (v) => v.statut === StatutVehicule.INACTIF
        );
        this.vehiculesEnReparation = vehicules.filter(
          (v) => v.statut === StatutVehicule.EN_REPARATION
        );
        this.vehiculesEnMission = vehicules.filter(
          (v) => v.statut === StatutVehicule.EN_MISSION
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addVehicule(): void {
    const dialogRef = this.dialog.open(VehiculeFormDialogComponent, {
      width: '600px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Véhicule ajouté avec succès', 'Fermer', {
          duration: 3000,
        });
      }
    });
  }

  editVehicule(vehicule: Vehicule): void {
    const dialogRef = this.dialog.open(VehiculeFormDialogComponent, {
      width: '600px',
      data: vehicule,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Véhicule modifié avec succès', 'Fermer', {
          duration: 3000,
        });
      }
    });
  }

  deleteVehicule(vehicule: Vehicule): void {
    this.confirmDialogService
      .confirmDelete(`Véhicule ${vehicule.matricule}`)
      .subscribe((confirmed) => {
        if (confirmed) {
          this.store.dispatch(deleteVehicule({ id: vehicule.id }));
          this.snackBar.open('Véhicule supprimé', 'Fermer', {
            duration: 3000,
          });
        }
      });
  }
}
