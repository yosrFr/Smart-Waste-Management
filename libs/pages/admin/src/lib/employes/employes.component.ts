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
  selectAllEmployes,
  selectEmployesOnly,
  selectEmployesLoading,
  loadEmployes,
  deleteEmploye,
  Employe,
  Utilisateur,
  Disponibilite,
  Role,
  Administrateur,
  selectAdminsOnly,
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
  ConfirmDialogService,
  EnumLabelPipe,
} from '@smart-waste-management/shared/ui';
import { EmployeFormDialogComponent } from './employe-form-dialog.component';

/**
 * Composant page Employés
 */
@Component({
  selector: 'lib-employes',
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
  templateUrl: './employes.component.html',
})
export class EmployesComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private confirmDialogService = inject(ConfirmDialogService);

  loading$: Observable<boolean> = this.store.select(selectEmployesLoading);
  private destroy$ = new Subject<void>();

  // Données par disponibilité
  employesDisponibles: Employe[] = [];
  employesEnMission: Employe[] = [];
  admin: Administrateur[] = [];

  totalEmployes = 0;
  totalAdmins = 0;

  // Configuration des tabs
  tabs: Tab[] = [
    { label: 'Disponibles', value: Disponibilite.DISPONIBLE },
    { label: 'En mission', value: Disponibilite.EN_MISSION },
    { label: 'Admin', value: Role.ADMIN },
  ];
  selectedTabIndex = 0;

  // Configuration du tableau
  tableColumns: TableColumn<Employe | Administrateur>[] = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'prenom', label: 'Prénom', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'tel', label: 'Téléphone' },
    {
      key: 'numPermis',
      label: 'Permis',
      customTemplate: (e) => ('numPermis' in e ? e.numPermis : 'N/A'),
    },
  ];

  tableActions: TableAction<Employe | Administrateur>[] = [
    {
      icon: 'edit',
      action: (employe) => this.editEmploye(employe),
    },
    {
      icon: 'delete',
      action: (employe) => this.deleteEmploye(employe),
    },
  ];

  constructor() {
    this.loading$ = this.store.select(selectEmployesLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadEmployes());

    this.store
      .select(selectEmployesOnly)
      .pipe(takeUntil(this.destroy$))
      .subscribe((employes) => {
        this.totalEmployes = employes.length;

        // Filtre par disponibilité
        this.employesDisponibles = employes.filter(
          (e) => e.disponibilite === Disponibilite.DISPONIBLE
        );
        this.employesEnMission = employes.filter(
          (e) => e.disponibilite === Disponibilite.EN_MISSION
        );
      });

    this.store
      .select(selectAdminsOnly)
      .pipe(takeUntil(this.destroy$))
      .subscribe((admins) => {
        this.totalAdmins = admins.length;
        this.admin = admins;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addEmploye(): void {
    const dialogRef = this.dialog.open(EmployeFormDialogComponent, {
      width: '700px',
      data: { mode: 'create', employe: null },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.snackBar.open('Employé ajouté avec succès', 'Fermer', {
            duration: 3000,
          });
        }
      });
  }

  editEmploye(employe: Employe | Administrateur): void {
    const dialogRef = this.dialog.open(EmployeFormDialogComponent, {
      width: '700px',
      data: { mode: 'edit', employe },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.snackBar.open('Employé modifié avec succès', 'Fermer', {
            duration: 3000,
          });
        }
      });
  }

  deleteEmploye(employe: Employe | Administrateur): void {
    this.confirmDialogService
      .confirmDelete(`${employe.prenom} ${employe.nom}`)
      .subscribe((confirmed) => {
        if (confirmed) {
          this.store.dispatch(deleteEmploye({ id: employe.id }));
          this.snackBar.open('Employé supprimé', 'Fermer', {
            duration: 3000,
          });
        }
      });
  }
}
