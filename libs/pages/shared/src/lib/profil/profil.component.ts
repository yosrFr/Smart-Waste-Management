/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { filter, map, Observable, Subject, take, takeUntil } from 'rxjs';
import {
  Utilisateur,
  Employe,
  AuthService,
  selectAllEmployes,
  loadEmployes,
  Administrateur,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  StatusBadgeComponent,
  EnumLabelPipe,
  LoadingSpinnerComponent,
} from '@smart-waste-management/shared/ui';
import { ProfilFormDialogComponent } from './profil-form-dialog/profil-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Composant page Profil
 * Affiche les informations de l'utilisateur connecté, modifier le profil et changer le mot de passe
 */
@Component({
  selector: 'lib-profil',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    EnumLabelPipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  isEmployee = false;

  private destroy$ = new Subject<void>();

  currentUser$: Observable<Employe | Administrateur>;

  constructor() {
    this.currentUser$ = this.store.select(selectAllEmployes).pipe(
      map((users) =>
        users.find((u) => u.email === this.authService.getUserEmailFromToken())
      ),
      filter((user): user is NonNullable<typeof user> => !!user)
    );
  }

  /** Initialise le composant et vérifie si l'utilisateur est employé */
  ngOnInit(): void {
    if (this.authService.getRolesFromToken()[0]) {
      this.isEmployee = true;
    }
  }

  /**
   * Vérifie si l'utilisateur est de type employé
   * @param user utilisateur à tester
   * @returns true si l'utilisateur est un employé
   */
  isEmploye(user: Utilisateur): user is Employe {
    return 'disponibilite' in user;
  }

  /**
   * Retourne la couleur du badge en fonction de la disponibilité
   * @param disponibilite État de disponibilité de l'employé
   * @returns 'success' | 'warning' | 'default' qui désignent la couleur
   */
  getDisponibiliteColor(
    disponibilite: string
  ): 'success' | 'warning' | 'default' {
    switch (disponibilite) {
      case 'DISPONIBLE':
        return 'success';
      case 'EN_MISSION':
        return 'warning';
      default:
        return 'default';
    }
  }

  /** Ouvre le dialogue pour modifier le profil */
  editProfile(): void {
    // // Récupérer l'utilisateur actuel
    // this.currentUser$ = this.store.select(selectAllEmployes).pipe(
    //   map((users) =>
    //     users.find((u) => u.email === this.authService.getUserEmailFromToken())
    //   ),
    //   filter((user): user is NonNullable<typeof user> => !!user)
    // );

    // Ouvrir le dialogue avec les données utilisateur
    this.currentUser$.pipe(take(1)).subscribe((user) => {
      const dialogRef = this.dialog.open(ProfilFormDialogComponent, {
        width: '700px',
        data: {
          employe: user,
        },
      });

      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          if (result) {
            this.snackBar.open('Profil modifié avec succès', 'Fermer', {
              duration: 3000,
            });
          }
        });
    });
  }
  /** Navigue vers la page de changement de mot de passe */
  changePassword(): void {
    this.router.navigate(['/auth/change-password']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
