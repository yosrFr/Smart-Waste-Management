/* eslint-disable @nx/enforce-module-boundaries */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  selectCurrentUser,
  Utilisateur,
  Employe,
} from '@smart-waste-management/shared/data-access';
import {
  PageHeaderComponent,
  StatusBadgeComponent,
  EnumLabelPipe,
  ConfirmDialogService,
} from '@smart-waste-management/shared/ui';
import { ProfilFormDialogComponent } from './profil-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Composant page Profil
 * Affiche les informations de l'utilisateur connecté
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
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private confirmDialogService = inject(ConfirmDialogService);

  currentUser$: Observable<Utilisateur | null>;
  isEmployee = false;

  private destroy$ = new Subject<void>();

  constructor() {
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit(): void {
    this.currentUser$.subscribe((user) => {
      this.isEmployee = user?.role === 'EMPLOYE';
    });
  }

  /**
   * Vérifie si l'utilisateur est un employé
   */
  isEmploye(user: Utilisateur): user is Employe {
    return 'disponibilite' in user;
  }

  /**
   * Retourne la couleur du badge de disponibilité
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

  editProfile(): void {
    const dialogRef = this.dialog.open(ProfilFormDialogComponent, {
      width: '700px',
      data: {
        employe: this.currentUser$,
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
  }
  /**
   * Navigue vers la page de changement de mot de passe
   */
  changePassword(): void {
    this.router.navigate(['/auth/change-password']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
